'use client'

import Link from 'next/link'
import { Trade } from '@/types/trade'
import { ArrowUpRight, ArrowDownRight, ChevronRight, Image as ImageIcon } from 'lucide-react'

interface TradeCardProps {
  trade: Trade
}

function ResultBadge({ result }: { result: string | null | undefined }) {
  if (!result) return <span className="text-tv-muted text-xs">Open</span>

  const styles: Record<string, string> = {
    Win:  'badge-win',
    Loss: 'badge-loss',
    BE:   'badge-be',
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[result] || ''}`}>
      {result}
    </span>
  )
}

export default function TradeCard({ trade }: TradeCardProps) {
  const isLong = trade.direction === 'Long'
  const pl = trade.profitLoss ?? 0
  const isProfit = pl > 0

  const hasScreenshots = trade.entryScreenshot || trade.exitScreenshot ||
    (trade.extraScreenshots && JSON.parse(trade.extraScreenshots).length > 0)

  return (
    <Link href={`/trades/${trade.id}`}>
      <div className="tv-card p-4 hover:border-tv-border/80 hover:bg-tv-hover/20 transition-all duration-150 cursor-pointer group animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Instrument + direction */}
          <div className="flex items-center gap-3 min-w-0">
            <div className={`
              w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0
              ${isLong ? 'bg-tv-greenDim' : 'bg-tv-redDim'}
            `}>
              {isLong
                ? <ArrowUpRight className="w-4 h-4 text-tv-green" />
                : <ArrowDownRight className="w-4 h-4 text-tv-red" />
              }
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-tv-text font-mono text-sm">{trade.instrument}</span>
                <span className={`text-xs font-medium ${isLong ? 'text-tv-green' : 'text-tv-red'}`}>
                  {trade.direction}
                </span>
                <ResultBadge result={trade.result} />
              </div>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-tv-muted">
                <span>{trade.date}</span>
                <span>{trade.time}</span>
              </div>
            </div>
          </div>

          {/* Right: P/L + RR */}
          <div className="flex items-center gap-6 flex-shrink-0">
            {/* P/L */}
            {trade.profitLoss !== null && trade.profitLoss !== undefined ? (
              <div className="text-right">
                <div className={`font-mono font-semibold text-sm ${isProfit ? 'text-tv-green' : pl < 0 ? 'text-tv-red' : 'text-tv-muted'}`}>
                  {isProfit ? '+' : ''}{pl.toFixed(2)}$
                </div>
                <div className="text-xs text-tv-muted">P/L</div>
              </div>
            ) : (
              <div className="text-right">
                <div className="font-mono text-sm text-tv-muted">—</div>
                <div className="text-xs text-tv-muted">P/L</div>
              </div>
            )}

            {/* RR */}
            <div className="text-right hidden sm:block">
              <div className="font-mono text-sm text-tv-text">
                {trade.riskReward ? `${trade.riskReward.toFixed(2)}R` : '—'}
              </div>
              <div className="text-xs text-tv-muted">R/R</div>
            </div>

            {/* Risk */}
            <div className="text-right hidden md:block">
              <div className="font-mono text-sm text-tv-text">{trade.riskAmount.toFixed(2)}$</div>
              <div className="text-xs text-tv-muted">Risk</div>
            </div>

            {/* Screenshots indicator */}
            {hasScreenshots && (
              <ImageIcon className="w-3.5 h-3.5 text-tv-muted hidden sm:block" />
            )}

            <ChevronRight className="w-4 h-4 text-tv-muted group-hover:text-tv-text transition-colors" />
          </div>
        </div>

        {/* Entry reason preview */}
        {trade.entryReason && (
          <p className="mt-2.5 text-xs text-tv-muted line-clamp-1 pl-11">
            {trade.entryReason}
          </p>
        )}
      </div>
    </Link>
  )
}
