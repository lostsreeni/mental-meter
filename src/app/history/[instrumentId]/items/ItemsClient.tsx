'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/database'
import { getInstrument, type InstrumentId } from '@/lib/instruments'

type SortMode = 'order' | 'frequency' | 'recency'

export default function ItemBreakdownPage() {
  const router = useRouter()
  const params = useParams<{ instrumentId: string }>()
  const instrumentId = params.instrumentId as InstrumentId
  const instrument = getInstrument(instrumentId)
  const [sort, setSort] = useState<SortMode>('order')

  const data = useLiveQuery(async () => {
    const checkins = await db.checkins.where('type').equals(instrumentId).toArray()
    const byTime = checkins.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp))
    const responseMap = new Map<number, Record<string, number | null>>()
    for (const c of byTime) {
      const rs = await db.responses.where('checkinId').equals(c.id!).toArray()
      responseMap.set(c.id!, Object.fromEntries(rs.map((r) => [r.questionId, r.value])))
    }
    return { checkins: byTime, responseMap }
  }, [instrumentId])

  const rows = useMemo(() => {
    if (!data) return []
    const out = instrument.questions.map((q, idx) => {
      const values = data.checkins.map((c) => data.responseMap.get(c.id!)?.[q.key] ?? null)
      const answered = values.filter((v): v is number => v !== null)
      const mean = answered.length ? answered.reduce((a, b) => a + b, 0) / answered.length : null
      const elevated = answered.filter((v) => v >= 2).length
      const pct = answered.length ? Math.round((elevated / answered.length) * 100) : 0
      const lastElevIdx = values.map((v, i) => ({ v, i })).filter((x) => x.v !== null && x.v >= 2).at(-1)?.i ?? -1
      const lastElevDate = lastElevIdx >= 0 ? new Date(data.checkins[lastElevIdx].timestamp).toLocaleDateString() : '—'
      return { q, idx, values, mean, pct, lastElevIdx, lastElevDate }
    })
    if (sort === 'frequency') return out.sort((a, b) => b.pct - a.pct)
    if (sort === 'recency') return out.sort((a, b) => b.lastElevIdx - a.lastElevIdx)
    return out
  }, [data, instrument, sort])

  const maxScale = instrument.questions[0]?.scale.at(-1)?.value ?? 3

  return (
    <div className="min-h-screen bg-background px-4 py-4 pb-20">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-xl font-semibold">{instrument.shortName} item breakdown</h1>
        <div className="flex gap-2">
          {(['order', 'frequency', 'recency'] as SortMode[]).map((s) => (
            <button key={s} onClick={() => setSort(s)} className={`px-3 py-1 rounded-full border text-xs ${sort === s ? 'bg-primary text-primary-foreground' : ''}`}>
              {s === 'order' ? 'Question order' : s === 'frequency' ? 'Most elevated' : 'Recent elevation'}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto border rounded-xl">
          <div className="min-w-[760px]">
            {rows.map((row) => (
              <div key={row.q.key} className="border-b last:border-b-0 p-2">
                <button className="w-full text-left" onClick={() => router.push(`/history?instrument=${instrumentId}&item=${row.q.key}`)}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{row.q.text}</p>
                    {row.q.key === 'phq9_q9' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700">critical item</span>}
                  </div>
                </button>
                <div className="mt-2 flex gap-1">
                  {row.values.map((v, i) => {
                    const n = v ?? -1
                    const intensity = n < 0 ? 0.08 : (n + 1) / (maxScale + 1)
                    const isWho5 = instrumentId === 'who5'
                    const bg = isWho5 ? `rgba(134,182,164,${intensity})` : `rgba(91,138,138,${intensity})`
                    const warn = row.q.key === 'phq9_q9' && v !== null && v >= 1
                    return <div key={i} title={`${v ?? 'Skipped'}`} className={`w-6 h-6 rounded-sm border ${warn ? 'ring-2 ring-red-500' : ''}`} style={{ backgroundColor: bg }} />
                  })}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Mean: {row.mean?.toFixed(2) ?? '—'} · ≥2: {row.pct}% · Last elevated: {row.lastElevDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
