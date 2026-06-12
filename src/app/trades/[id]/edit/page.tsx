import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TradeForm from '@/components/TradeForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Trade } from '@/types/trade'

export const metadata = {
  title: 'Edit Trade — Trading Journal',
}

export default async function EditTradePage({ params }: { params: { id: string } }) {
  const trade = await prisma.trade.findUnique({ where: { id: params.id } })

  if (!trade) notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      <div>
        <Link
          href={`/trades/${trade.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-tv-muted hover:text-tv-text transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Trade
        </Link>
        <h1 className="text-xl font-semibold text-tv-text">Edit Trade</h1>
        <p className="text-sm text-tv-muted mt-0.5">{trade.instrument} · {trade.date}</p>
      </div>

      <TradeForm mode="edit" initialData={trade as unknown as Trade} />
    </div>
  )
}
