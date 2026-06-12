import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import TradeCard from '@/components/TradeCard'
import { Trade } from '@/types/trade'
import { PlusCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'

async function getTrades(userId: string): Promise<Trade[]> {
  const trades = await prisma.trade.findMany({
    where: {
      userId,
    },
    orderBy: [{ date: 'desc' }, { time: 'desc' }],
  })

  return trades as unknown as Trade[]
}

function computeQuickStats(trades: Trade[]) {
  const closed = trades.filter(t => t.result !== null && t.result !== undefined)
  const wins = closed.filter(t => t.result === 'Win').length
  const losses = closed.filter(t => t.result === 'Loss').length
  const winRate = closed.length > 0 ? (wins / closed.length) * 100 : 0
  const totalPL = trades.reduce((sum, t) => sum + (t.profitLoss ?? 0), 0)

  return { total: trades.length, wins, losses, winRate, totalPL }
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  const trades = await getTrades(userId)
  const stats = computeQuickStats(trades)

  const recentTrades = trades.slice(0, 50)
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-tv-text">Trade Journal</h1>
          <p className="text-sm text-tv-muted mt-0.5">
            {trades.length} trade{trades.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <Link
          href="/trades/new"
          className="flex items-center gap-2 px-4 py-2 bg-tv-accent hover:bg-tv-accentHov text-white rounded-md text-sm font-medium transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Trade
        </Link>
      </div>

      {/* Quick stats bar */}
      {trades.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="tv-card px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-tv-accent/15 flex items-center justify-center">
              <span className="text-tv-accent font-mono text-xs font-bold">#</span>
            </div>
            <div>
              <div className="font-mono font-semibold text-tv-text">{stats.total}</div>
              <div className="text-xs text-tv-muted">Total Trades</div>
            </div>
          </div>

          <div className="tv-card px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-tv-greenDim flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-tv-green" />
            </div>
            <div>
              <div className="font-mono font-semibold text-tv-green">{stats.winRate.toFixed(1)}%</div>
              <div className="text-xs text-tv-muted">Win Rate</div>
            </div>
          </div>

          <div className="tv-card px-4 py-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
              stats.totalPL >= 0 ? 'bg-tv-greenDim' : 'bg-tv-redDim'
            }`}>
              {stats.totalPL >= 0
                ? <TrendingUp className="w-4 h-4 text-tv-green" />
                : <TrendingDown className="w-4 h-4 text-tv-red" />
              }
            </div>
            <div>
              <div className={`font-mono font-semibold ${stats.totalPL >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
                {stats.totalPL >= 0 ? '+' : ''}{stats.totalPL.toFixed(2)}$
              </div>
              <div className="text-xs text-tv-muted">Total P/L</div>
            </div>
          </div>

          <div className="tv-card px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-tv-border flex items-center justify-center">
              <Minus className="w-4 h-4 text-tv-muted" />
            </div>
            <div>
              <div className="font-mono font-semibold text-tv-text">
                {stats.wins}W / {stats.losses}L
              </div>
              <div className="text-xs text-tv-muted">W/L Breakdown</div>
            </div>
          </div>
        </div>
      )}

      {/* Trades list */}
      {trades.length === 0 ? (
        <div className="tv-card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-tv-border flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-tv-muted" />
          </div>
          <h2 className="text-base font-medium text-tv-text">No trades yet</h2>
          <p className="text-sm text-tv-muted mt-1 max-w-xs">
            Start documenting your trades to track performance and improve your strategy.
          </p>
          <Link
            href="/trades/new"
            className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-tv-accent hover:bg-tv-accentHov text-white rounded-md text-sm font-medium transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Record First Trade
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {recentTrades.map(trade => (
            <TradeCard key={trade.id} trade={trade} />
          ))}

          {trades.length > 50 && (
            <p className="text-center text-xs text-tv-muted py-4">
              Showing 50 of {trades.length} trades. Use filters to narrow down.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
