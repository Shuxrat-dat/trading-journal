import TradeForm from '@/components/TradeForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata = {
  title: 'New Trade — Trading Journal',
}

export default function NewTradePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-tv-muted hover:text-tv-text transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Journal
        </Link>
        <h1 className="text-xl font-semibold text-tv-text">Record New Trade</h1>
        <p className="text-sm text-tv-muted mt-0.5">Document your trade setup and analysis</p>
      </div>

      <TradeForm mode="create" />
    </div>
  )
}
