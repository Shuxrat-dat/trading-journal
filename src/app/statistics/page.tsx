import { prisma } from '@/lib/prisma'
import { Trade } from '@/types/trade'
import StatsCard from '@/components/StatsCard'
import EquityCurve from './EquityCurve'
import { TrendingUp, TrendingDown, BarChart2, Award, Target } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

async function getTrades(userId: string): Promise<Trade[]> {
  const trades = await prisma.trade.findMany({
    where: {
      userId,
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })

  return trades as unknown as Trade[]
}

function computeStats(trades: Trade[]) {
  const closed = trades.filter(t => t.result && t.profitLoss !== null)
  const wins = closed.filter(t => t.result === 'Win')
  const losses = closed.filter(t => t.result === 'Loss')
  const be = closed.filter(t => t.result === 'BE')

  const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0
  const totalPL = closed.reduce((s, t) => s + (t.profitLoss ?? 0), 0)

  const avgWin = wins.length > 0
    ? wins.reduce((s, t) => s + (t.profitLoss ?? 0), 0) / wins.length
    : 0
  const avgLoss = losses.length > 0
    ? Math.abs(losses.reduce((s, t) => s + (t.profitLoss ?? 0), 0) / losses.length)
    : 0

  // Max drawdown
  let peak = 0
  let equity = 0
  let maxDD = 0
  for (const t of closed) {
    equity += t.profitLoss ?? 0
    if (equity > peak) peak = equity
    const dd = peak - equity
    if (dd > maxDD) maxDD = dd
  }

  // Profit factor
  const grossWin = wins.reduce((s, t) => s + (t.profitLoss ?? 0), 0)
  const grossLoss = Math.abs(losses.reduce((s, t) => s + (t.profitLoss ?? 0), 0))
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0

  // Avg R/R
  const tradesWithRR = closed.filter(t => t.riskReward && t.riskReward > 0)
  const avgRR = tradesWithRR.length > 0
    ? tradesWithRR.reduce((s, t) => s + (t.riskReward ?? 0), 0) / tradesWithRR.length
    : 0

  // By instrument
  const byInstrument: Record<string, { count: number; pl: number }> = {}
  for (const t of closed) {
    if (!byInstrument[t.instrument]) byInstrument[t.instrument] = { count: 0, pl: 0 }
    byInstrument[t.instrument].count++
    byInstrument[t.instrument].pl += t.profitLoss ?? 0
  }

  // Equity curve data
  let runningPL = 0
  const equityCurve = closed.map((t, i) => {
    runningPL += t.profitLoss ?? 0
    return { trade: i + 1, equity: parseFloat(runningPL.toFixed(2)), date: t.date }
  })

  // Monthly breakdown
  const monthly: Record<string, number> = {}
  for (const t of closed) {
    const month = t.date.slice(0, 7)
    monthly[month] = (monthly[month] ?? 0) + (t.profitLoss ?? 0)
  }

  return {
    total: trades.length,
    closed: closed.length,
    wins: wins.length,
    losses: losses.length,
    be: be.length,
    winRate,
    totalPL,
    avgWin,
    avgLoss,
    maxDD,
    profitFactor: isFinite(profitFactor) ? profitFactor : 999,
    avgRR,
    byInstrument,
    equityCurve,
    monthly,
    longTrades: closed.filter(t => t.direction === 'Long').length,
    shortTrades: closed.filter(t => t.direction === 'Short').length,
  }
}

export const metadata = {
  title: 'Statistics — Trading Journal',
}

export default async function StatisticsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  const trades = await getTrades(userId)
  const s = computeStats(trades)

  const topInstruments = Object.entries(s.byInstrument)
    .sort((a, b) => b[1].pl - a[1].pl)
    .slice(0, 5)

  const monthlyEntries = Object.entries(s.monthly).sort()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-tv-text">Statistics</h1>
        <p className="text-sm text-tv-muted mt-0.5">
          Based on {s.closed} closed trades
        </p>
      </div>

      {s.closed === 0 ? (
        <div className="tv-card flex flex-col items-center justify-center py-20 text-center">
          <BarChart2 className="w-12 h-12 text-tv-muted mb-3" />
          <h2 className="text-base font-medium text-tv-text">No closed trades yet</h2>
          <p className="text-sm text-tv-muted mt-1">Record trades with results to see statistics.</p>
        </div>
      ) : (
        <>
          {/* Core metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatsCard
              label="Total Trades"
              value={s.total}
              subValue={`${s.closed} closed`}
              color="blue"
              size="lg"
            />
            <StatsCard
              label="Win Rate"
              value={`${s.winRate.toFixed(1)}%`}
              subValue={`${s.wins}W / ${s.losses}L / ${s.be}BE`}
              color={s.winRate >= 50 ? 'green' : 'red'}
              size="lg"
            />
            <StatsCard
              label="Total P/L"
              value={`${s.totalPL >= 0 ? '+' : ''}${s.totalPL.toFixed(2)}$`}
              color={s.totalPL >= 0 ? 'green' : 'red'}
              size="lg"
            />
            <StatsCard
              label="Profit Factor"
              value={s.profitFactor >= 999 ? '∞' : s.profitFactor.toFixed(2)}
              subValue="Gross win / gross loss"
              color={s.profitFactor >= 1.5 ? 'green' : s.profitFactor >= 1 ? 'yellow' : 'red'}
              size="lg"
            />
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatsCard label="Avg Win" value={`+${s.avgWin.toFixed(2)}$`} color="green" />
            <StatsCard label="Avg Loss" value={`-${s.avgLoss.toFixed(2)}$`} color="red" />
            <StatsCard label="Max Drawdown" value={`-${s.maxDD.toFixed(2)}$`} color="red" />
            <StatsCard label="Avg Risk/Reward" value={`${s.avgRR.toFixed(2)}R`} color="yellow" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatsCard label="Long Trades" value={s.longTrades} subValue="direction" color="green" />
            <StatsCard label="Short Trades" value={s.shortTrades} subValue="direction" color="red" />
            <StatsCard
              label="Expectancy"
              value={`${((s.winRate / 100 * s.avgWin) - ((1 - s.winRate / 100) * s.avgLoss)).toFixed(2)}$`}
              subValue="per trade"
              color={(s.winRate / 100 * s.avgWin) > ((1 - s.winRate / 100) * s.avgLoss) ? 'green' : 'red'}
            />
            <StatsCard
              label="Recovery Factor"
              value={s.maxDD > 0 ? (s.totalPL / s.maxDD).toFixed(2) : '—'}
              subValue="P/L ÷ Max DD"
            />
          </div>

          {/* Equity curve */}
          {s.equityCurve.length > 1 && (
            <div className="tv-card p-4">
              <h2 className="text-sm font-semibold text-tv-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Equity Curve
              </h2>
              <EquityCurve data={s.equityCurve} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Instruments */}
            {topInstruments.length > 0 && (
              <div className="tv-card p-4">
                <h2 className="text-sm font-semibold text-tv-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" /> By Instrument
                </h2>
                <div className="space-y-2">
                  {topInstruments.map(([instrument, data]) => (
                    <div key={instrument} className="flex items-center justify-between py-2 border-b border-tv-border last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-medium text-tv-text">{instrument}</span>
                        <span className="text-xs text-tv-muted">{data.count} trades</span>
                      </div>
                      <span className={`font-mono text-sm font-semibold ${data.pl >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
                        {data.pl >= 0 ? '+' : ''}{data.pl.toFixed(2)}$
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly P/L */}
            {monthlyEntries.length > 0 && (
              <div className="tv-card p-4">
                <h2 className="text-sm font-semibold text-tv-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Monthly P/L
                </h2>
                <div className="space-y-2">
                  {monthlyEntries.slice(-6).reverse().map(([month, pl]) => (
                    <div key={month} className="flex items-center justify-between py-2 border-b border-tv-border last:border-0">
                      <span className="text-sm text-tv-text">
                        {new Date(month + '-01').toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                      </span>
                      <span className={`font-mono text-sm font-semibold ${pl >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
                        {pl >= 0 ? '+' : ''}{pl.toFixed(2)}$
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
