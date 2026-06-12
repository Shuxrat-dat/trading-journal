'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  label: string
  value: string | null
  onChange: (url: string | null) => void
  placeholder?: string
}

export function ImageUpload({ label, value, onChange, placeholder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed')
        return
      }

      onChange(data.url)
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-tv-muted uppercase tracking-wider font-medium block">
        {label}
      </label>

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-tv-border">
          <div className="relative w-full h-40">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-colors duration-150
            ${uploading ? 'border-tv-accent bg-tv-accent/5' : 'border-tv-border hover:border-tv-muted hover:bg-tv-hover/20'}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-tv-accent animate-spin" />
              <span className="text-xs text-tv-muted">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-tv-muted" />
              <span className="text-xs text-tv-muted">
                {placeholder || 'Click or drag image here'}
              </span>
              <span className="text-xs text-tv-muted opacity-60">PNG, JPG, WebP up to 10MB</span>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-tv-red">{error}</p>}
    </div>
  )
}

interface MultiImageUploadProps {
  label: string
  values: string[]
  onChange: (urls: string[]) => void
}

export function MultiImageUpload({ label, values, onChange }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed')
        return
      }

      onChange([...values, data.url])
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-tv-muted uppercase tracking-wider font-medium block">
        {label}
      </label>

      <div className="grid grid-cols-2 gap-2">
        {values.map((url, i) => (
          <div key={i} className="relative group rounded-lg overflow-hidden border border-tv-border">
            <div className="relative w-full h-28">
              <Image src={url} alt={`screenshot-${i + 1}`} fill className="object-cover" />
            </div>
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}

        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-tv-border rounded-lg h-28 flex flex-col items-center
                     justify-center cursor-pointer hover:border-tv-muted hover:bg-tv-hover/20 transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
            className="hidden"
          />

          {uploading ? (
            <Loader2 className="w-5 h-5 text-tv-accent animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5 text-tv-muted" />
              <span className="text-xs text-tv-muted mt-1">Add</span>
            </>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-tv-red">{error}</p>}
    </div>
  )
}
