'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteTradeButton({ tradeId }: { tradeId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await fetch(`/api/trades/${tradeId}`, { method: 'DELETE' })
      router.push('/')
      router.refresh()
    } catch {
      setLoading(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-tv-red">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1.5 bg-tv-red/20 border border-tv-red/40 text-tv-red rounded-md text-sm
                     hover:bg-tv-red/30 transition-colors flex items-center gap-1.5 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          Yes, delete
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 text-sm text-tv-muted hover:text-tv-text transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-tv-surface border border-tv-border rounded-md
                 text-sm text-tv-muted hover:text-tv-red hover:border-tv-red/40 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Delete
    </button>
  )
}
