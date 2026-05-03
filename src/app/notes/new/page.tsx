'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createNote } from '@/lib/db/repositories/notes'

export default function NewNotePage() {
  const router = useRouter()
  const [checkinId, setCheckinId] = useState<number | null>(null)
  const [instrumentId, setInstrumentId] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = Number(params.get('checkinId') ?? '')
    setCheckinId(Number.isFinite(id) ? id : null)
    setInstrumentId(params.get('instrumentId') ?? '')
  }, [])

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-lg mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Add a note</h1>
        <p className="text-sm text-muted-foreground">
          Add context for this check-in{instrumentId ? ` (${instrumentId.toUpperCase()})` : ''}.
        </p>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="e.g., rough day at work" className="min-h-40 rounded-xl border border-border bg-card text-foreground p-4" />
        <div className="flex gap-2">
          <button onClick={() => router.back()} className="flex-1 min-h-12 rounded-xl border border-border">Cancel</button>
          <button
            onClick={async () => {
              if (!content.trim()) return
              await createNote({ timestamp: new Date(), content: content.trim(), checkinId: Number.isFinite(checkinId) ? checkinId : null })
              router.push('/')
            }}
            className="flex-1 min-h-12 rounded-xl bg-primary text-primary-foreground"
          >Save note</button>
        </div>
      </div>
    </div>
  )
}
