'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trade } from '@/types/trade'
import { ImageUpload, MultiImageUpload } from './ImageUpload'
import { Save, Loader2, Calculator } from 'lucide-react'

const INSTRUMENTS = [
  'BTCUSD', 'ETHUSD', 'BNBUSD', 'SOLUSD', 'XRPUSD',
  'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD',
  'GOLD', 'SILVER', 'OIL', 'SP500', 'NASDAQ',
]

const EMOTION_OPTIONS = [
  'Calm & Focused', 'Confident', 'Slightly Anxious', 'FOMO',
  'Overconfident', 'Fear', 'Revenge Mode', 'Neutral',
]

interface TradeFormProps {
  initialData?: Trade
  mode: 'create' | 'edit'
}

type FormData = {
  date: string
  time: string
  instrument: string
  direction: 'Long' | 'Short'
  entryPrice: string
  stopLoss: string
  takeProfit: string
  exitPrice: string
  riskAmount: string
  profitLoss: string
  riskReward: string
  result: string
  emotions: string
  entryReason: string
  mistakes: string
  whatWentRight: string
  conclusions: string
  entryScreenshot: string | null
  exitScreenshot: string | null
  extraScreenshots: string[]
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-tv-muted uppercase tracking-wider font-medium block">
        {label}
        {hint && <span className="ml-1 normal-case text-tv-muted/60">({hint})</span>}
      </label>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full mt-2">
      <h3 className="text-xs font-semibold text-tv-muted uppercase tracking-widest border-b border-tv-border pb-2">
        {children}
      </h3>
    </div>
  )
}

export default function TradeForm({ initialData, mode }: TradeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date()
  const defaultDate = today.toISOString().split('T')[0]
  const defaultTime = today.toTimeString().slice(0, 5)

  const [form, setForm] = useState<FormData>({
    date: initialData?.date ?? defaultDate,
    time: initialData?.time ?? defaultTime,
    instrument: initialData?.instrument ?? 'BTCUSD',
    direction: (initialData?.direction as 'Long' | 'Short') ?? 'Long',
    entryPrice: initialData?.entryPrice?.toString() ?? '',
    stopLoss: initialData?.stopLoss?.toString() ?? '',
    takeProfit: initialData?.takeProfit?.toString() ?? '',
    exitPrice: initialData?.exitPrice?.toString() ?? '',
    riskAmount: initialData?.riskAmount?.toString() ?? '',
    profitLoss: initialData?.profitLoss?.toString() ?? '',
    riskReward: initialData?.riskReward?.toString() ?? '',
    result: initialData?.result ?? '',
    emotions: initialData?.emotions ?? '',
    entryReason: initialData?.entryReason ?? '',
    mistakes: initialData?.mistakes ?? '',
    whatWentRight: initialData?.whatWentRight ?? '',
    conclusions: initialData?.conclusions ?? '',
    entryScreenshot: initialData?.entryScreenshot ?? null,
    exitScreenshot: initialData?.exitScreenshot ?? null,
    extraScreenshots: initialData?.extraScreenshots
      ? JSON.parse(initialData.extraScreenshots)
      : [],
  })

  // Auto-calculate R/R when prices change
  useEffect(() => {
    const entry = parseFloat(form.entryPrice)
    const sl = parseFloat(form.stopLoss)
    const tp = parseFloat(form.takeProfit)

    if (entry && sl && tp && entry !== sl) {
      const risk = Math.abs(entry - sl)
      const reward = Math.abs(tp - entry)
      const rr = reward / risk
      setForm(prev => ({ ...prev, riskReward: rr.toFixed(2) }))
    }
  }, [form.entryPrice, form.stopLoss, form.takeProfit])

  function set(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload = {
        ...form,
        extraScreenshots: form.extraScreenshots,
      }

      const url = mode === 'create' ? '/api/trades' : `/api/trades/${initialData?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      const trade = await res.json()
      router.push(`/trades/${trade.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-tv-redDim border border-tv-red/30 rounded-lg px-4 py-3 text-sm text-tv-red">
          {error}
        </div>
      )}

      {/* Section: Trade Setup */}
      <div className="tv-card p-5">
        <h2 className="text-sm font-semibold text-tv-text mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-tv-accent rounded-full inline-block" />
          Trade Setup
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Date">
            <input type="date" value={form.date} onChange={set('date')} required />
          </Field>

          <Field label="Time">
            <input type="time" value={form.time} onChange={set('time')} required />
          </Field>

          <Field label="Instrument">
            <div className="relative">
              <input
                list="instruments"
                value={form.instrument}
                onChange={set('instrument')}
                placeholder="BTCUSD"
                required
              />
              <datalist id="instruments">
                {INSTRUMENTS.map(i => <option key={i} value={i} />)}
              </datalist>
            </div>
          </Field>

          <Field label="Direction">
            <div className="flex rounded-md overflow-hidden border border-tv-border">
              {(['Long', 'Short'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, direction: d }))}
                  className={`
                    flex-1 py-2 text-sm font-medium transition-colors
                    ${form.direction === d
                      ? d === 'Long'
                        ? 'bg-tv-green text-white'
                        : 'bg-tv-red text-white'
                      : 'text-tv-muted hover:text-tv-text bg-tv-bg'
                    }
                  `}
                >
                  {d}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </div>

      {/* Section: Price Levels */}
      <div className="tv-card p-5">
        <h2 className="text-sm font-semibold text-tv-text mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-tv-green rounded-full inline-block" />
          Price Levels
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Entry Price">
            <input
              type="number"
              step="any"
              value={form.entryPrice}
              onChange={set('entryPrice')}
              placeholder="0.00"
              required
              className="font-mono"
            />
          </Field>

          <Field label="Stop Loss">
            <input
              type="number"
              step="any"
              value={form.stopLoss}
              onChange={set('stopLoss')}
              placeholder="0.00"
              required
              className="font-mono"
            />
          </Field>

          <Field label="Take Profit">
            <input
              type="number"
              step="any"
              value={form.takeProfit}
              onChange={set('takeProfit')}
              placeholder="0.00"
              required
              className="font-mono"
            />
          </Field>

          <Field label="Exit Price" hint="optional">
            <input
              type="number"
              step="any"
              value={form.exitPrice}
              onChange={set('exitPrice')}
              placeholder="0.00"
              className="font-mono"
            />
          </Field>
        </div>
      </div>

      {/* Section: Risk & Result */}
      <div className="tv-card p-5">
        <h2 className="text-sm font-semibold text-tv-text mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-yellow-400 rounded-full inline-block" />
          Risk & Result
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Risk ($)">
            <input
              type="number"
              step="0.01"
              value={form.riskAmount}
              onChange={set('riskAmount')}
              placeholder="0.00"
              required
              className="font-mono"
            />
          </Field>

          <Field label="P/L ($)" hint="optional">
            <input
              type="number"
              step="0.01"
              value={form.profitLoss}
              onChange={set('profitLoss')}
              placeholder="0.00"
              className="font-mono"
            />
          </Field>

          <Field label="Risk/Reward">
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={form.riskReward}
                onChange={set('riskReward')}
                placeholder="Auto-calc"
                className="font-mono pr-8"
              />
              <Calculator className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-tv-muted" />
            </div>
          </Field>

          <Field label="Result">
            <select value={form.result} onChange={set('result')}>
              <option value="">— Select —</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="BE">Break Even</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Section: Psychology */}
      <div className="tv-card p-5">
        <h2 className="text-sm font-semibold text-tv-text mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-tv-accent rounded-full inline-block" />
          Psychology & Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Emotions Before Entry">
            <select value={form.emotions} onChange={set('emotions')}>
              <option value="">— Select state —</option>
              {EMOTION_OPTIONS.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </Field>

          <Field label="Entry Reason">
            <textarea
              value={form.entryReason}
              onChange={set('entryReason')}
              placeholder="Why did you enter this trade? What was the setup?"
              rows={3}
            />
          </Field>

          <Field label="Mistakes">
            <textarea
              value={form.mistakes}
              onChange={set('mistakes')}
              placeholder="What did you do wrong or could improve?"
              rows={3}
            />
          </Field>

          <Field label="What Went Right">
            <textarea
              value={form.whatWentRight}
              onChange={set('whatWentRight')}
              placeholder="What did you execute well?"
              rows={3}
            />
          </Field>

          <Field label="Conclusions">
            <textarea
              value={form.conclusions}
              onChange={set('conclusions')}
              placeholder="Key lessons and takeaways from this trade"
              rows={3}
              className="md:col-span-2"
            />
          </Field>
        </div>
      </div>

      {/* Section: Screenshots */}
      <div className="tv-card p-5">
        <h2 className="text-sm font-semibold text-tv-text mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-tv-muted rounded-full inline-block" />
          Screenshots
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImageUpload
            label="Entry Screenshot"
            value={form.entryScreenshot}
            onChange={url => setForm(prev => ({ ...prev, entryScreenshot: url }))}
            placeholder="Entry chart screenshot"
          />

          <ImageUpload
            label="Exit Screenshot"
            value={form.exitScreenshot}
            onChange={url => setForm(prev => ({ ...prev, exitScreenshot: url }))}
            placeholder="Exit chart screenshot"
          />

          <MultiImageUpload
            label="Additional Screenshots"
            values={form.extraScreenshots}
            onChange={urls => setForm(prev => ({ ...prev, extraScreenshots: urls }))}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-md text-sm text-tv-muted hover:text-tv-text hover:bg-tv-hover transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-tv-accent hover:bg-tv-accentHov text-white rounded-md text-sm font-medium
                     flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            : <><Save className="w-4 h-4" /> {mode === 'create' ? 'Save Trade' : 'Update Trade'}</>
          }
        </button>
      </div>
    </form>
  )
}
