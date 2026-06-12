import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Trade } from '@/types/trade'
import { ChevronLeft, Edit, ArrowUpRight, ArrowDownRight, Calendar, Clock, Target, Shield, TrendingUp, DollarSign, Brain, Lightbulb, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react'
import DeleteTradeButton from './DeleteTradeButton'

async function getTrade(id: string): Promise<Trade | null> {
  const trade = await prisma.trade.findUnique({ where: { id } })
  return trade as unknown as Trade | null
}

function Pill({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-tv-muted uppercase tracking-wider">{label}</span>
      <span className={`font-mono text-sm font-medium ${color ?? 'text-tv-text'}`}>{value}</span>
    </div>
  )
}

function ResultBadge({ result }: { result: string | null | undefined }) {
  if (!result) return null
  const styles: Record<string, string> = {
    Win:  'badge-win',
    Loss: 'badge-loss',
    BE:   'badge-be',
  }
  return (
    <span className={`px-3 py-1 rounded-md text-sm font-semibold ${styles[result] ?? ''}`}>
      {result === 'BE' ? 'Break Even' : result}
    </span>
  )
}

function InfoBlock({ icon: Icon, title, content }: {
  icon: React.ElementType
  title: string
  content?: string | null
}) {
  if (!content) return null
  return (
    <div className="tv-card p-4 space-y-2">
      <div className="flex items-center gap-2 text-tv-muted">
        <Icon className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider font-medium">{title}</span>
      </div>
      <p className="text-sm text-tv-text leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  )
}

export default async function TradePage({ params }: { params: { id: string } }) {
  const trade = await getTrade(params.id)

  if (!trade) notFound()

  const isLong = trade.direction === 'Long'
  const pl = trade.profitLoss ?? null
  const extraScreenshots: string[] = trade.extraScreenshots
    ? JSON.parse(trade.extraScreenshots)
    : []

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-slide-up">
      {/* Back nav + actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-tv-muted hover:text-tv-text transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Journal
        </Link>

        <div className="flex items-center gap-2">
          <DeleteTradeButton tradeId={trade.id} />
          <Link
            href={`/trades/${trade.id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-tv-surface border border-tv-border rounded-md
                       text-sm text-tv-text hover:bg-tv-hover transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Link>
        </div>
      </div>

      {/* Trade Header */}
      <div className="tv-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-2xl
              ${isLong ? 'bg-tv-greenDim' : 'bg-tv-redDim'}
            `}>
              {isLong
                ? <ArrowUpRight className="w-6 h-6 text-tv-green" />
                : <ArrowDownRight className="w-6 h-6 text-tv-red" />
              }
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold font-mono text-tv-text">{trade.instrument}</h1>
                <span className={`font-semibold ${isLong ? 'text-tv-green' : 'text-tv-red'}`}>
                  {trade.direction}
                </span>
                <ResultBadge result={trade.result} />
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-tv-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {trade.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {trade.time}
                </span>
              </div>
            </div>
          </div>

          {/* P/L big display */}
          {pl !== null && (
            <div className="text-right">
              <div className={`text-3xl font-mono font-bold ${pl >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
                {pl >= 0 ? '+' : ''}{pl.toFixed(2)}$
              </div>
              <div className="text-xs text-tv-muted mt-0.5">Profit / Loss</div>
            </div>
          )}
        </div>

        {/* Price Grid */}
        <div className="mt-5 pt-4 border-t border-tv-border grid grid-cols-3 md:grid-cols-6 gap-4">
          <Pill label="Entry" value={trade.entryPrice.toString()} color="text-tv-accent" />
          <Pill label="Stop Loss" value={trade.stopLoss.toString()} color="text-tv-red" />
          <Pill label="Take Profit" value={trade.takeProfit.toString()} color="text-tv-green" />
          <Pill
            label="Exit"
            value={trade.exitPrice ? trade.exitPrice.toString() : '—'}
            color={trade.exitPrice ? 'text-tv-text' : 'text-tv-muted'}
          />
          <Pill label="Risk" value={`${trade.riskAmount.toFixed(2)}$`} />
          <Pill
            label="R/R"
            value={trade.riskReward ? `${trade.riskReward.toFixed(2)}R` : '—'}
            color="text-yellow-400"
          />
        </div>
      </div>

     {/* Screenshots */}
{(trade.entryScreenshot || trade.exitScreenshot || extraScreenshots.length > 0) && (
  <div className="space-y-3">
    <h2 className="text-sm font-semibold text-tv-muted uppercase tracking-widest">
      Screenshots
    </h2>

    <div className="grid grid-cols-1 gap-4">
      {trade.entryScreenshot && (
        <div className="tv-card overflow-hidden">
          <div className="px-3 py-2 text-xs text-tv-muted border-b border-tv-border">
            Entry
          </div>

          <div className="relative w-full h-[600px]">
            <Image
              src={trade.entryScreenshot}
              alt="Entry"
              fill
              className="object-contain bg-black"
            />
          </div>
        </div>
      )}

      {trade.exitScreenshot && (
        <div className="tv-card overflow-hidden">
          <div className="px-3 py-2 text-xs text-tv-muted border-b border-tv-border">
            Exit
          </div>

          <div className="relative w-full h-[600px]">
            <Image
              src={trade.exitScreenshot}
              alt="Exit"
              fill
              className="object-contain bg-black"
            />
          </div>
        </div>
      )}

      {extraScreenshots.map((url, i) => (
        <div key={i} className="tv-card overflow-hidden">
          <div className="px-3 py-2 text-xs text-tv-muted border-b border-tv-border">
            Additional #{i + 1}
          </div>

          <div className="relative w-full h-[600px]">
            <Image
              src={url}
              alt={`Extra ${i + 1}`}
              fill
              className="object-contain bg-black"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      {/* Analysis Blocks */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-tv-muted uppercase tracking-widest">Trade Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoBlock icon={Brain} title="Emotions Before Entry" content={trade.emotions} />
          <InfoBlock icon={Target} title="Entry Reason" content={trade.entryReason} />
          <InfoBlock icon={CheckCircle} title="What Went Right" content={trade.whatWentRight} />
          <InfoBlock icon={AlertTriangle} title="Mistakes" content={trade.mistakes} />
        </div>

        <InfoBlock icon={BookOpen} title="Conclusions & Takeaways" content={trade.conclusions} />
      </div>
    </div>
  )
}
