'use client'

import { useLiveQuery } from 'dexie-react-hooks'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { db } from '@/lib/db/database'
import { instruments } from '@/lib/instruments'
import type { InstrumentId } from '@/lib/instruments'
import { cn } from '@/lib/utils'

// ─── Instrument metadata for display ─────────────────────────────────────────

const INSTRUMENT_GROUPS: { label: string; ids: InstrumentId[] }[] = [
  { label: 'Quick check-ins', ids: ['sleep', 'stress'] },
  { label: 'Depression', ids: ['phq2', 'phq9'] },
  { label: 'Anxiety', ids: ['gad2', 'gad7'] },
  { label: 'Well-being', ids: ['who5'] },
]

const SEVERITY_DOT: Record<string, string> = {
  minimal: 'bg-[var(--severity-minimal)]',
  mild: 'bg-[var(--severity-mild)]',
  moderate: 'bg-[var(--severity-moderate)]',
  severe: 'bg-[var(--severity-severe)]',
}

function formatRelativeTime(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (minutes < 2) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

// ─── Recent check-ins strip ───────────────────────────────────────────────────

function RecentCheckins() {
  const recent = useLiveQuery(
    () =>
      db.checkins
        .orderBy('timestamp')
        .reverse()
        .limit(5)
        .toArray(),
    []
  )

  if (!recent || recent.length === 0) return null

  return (
    <section aria-labelledby="recent-heading">
      <h2 id="recent-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Recent
      </h2>
      <div className="flex flex-col divide-y divide-border/60 rounded-2xl border border-border bg-card overflow-hidden">
        {recent.map((checkin) => {
          const inst = instruments[checkin.type as InstrumentId]
          const bandColor = checkin.severityBand
            ? (inst?.severityBands.find((b) => b.label === checkin.severityBand)?.color ?? null)
            : null
          return (
            <div key={checkin.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {inst?.shortName ?? checkin.type}
                  </span>
                  {bandColor && (
                    <span
                      className={cn('w-2 h-2 rounded-full flex-none', SEVERITY_DOT[bandColor])}
                      aria-hidden="true"
                    />
                  )}
                  {checkin.severityBand && (
                    <span className="text-xs text-muted-foreground truncate">
                      {checkin.severityBand}
                    </span>
                  )}
                  {checkin.score !== null && checkin.score !== undefined && (
                    <span className="ml-auto text-sm font-semibold text-foreground tabular-nums">
                      {checkin.score}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-muted-foreground flex-none">
                {formatRelativeTime(checkin.timestamp instanceof Date ? checkin.timestamp : new Date(checkin.timestamp))}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Instrument card ──────────────────────────────────────────────────────────

function InstrumentCard({ id }: { id: InstrumentId }) {
  const inst = instruments[id]
  const isCasual = id === 'sleep' || id === 'stress'
  const minutes = Math.round(inst.estimatedSeconds / 60) || 1

  // Most recent check-in for this instrument
  const latest = useLiveQuery(
    () =>
      db.checkins
        .where('[type+timestamp]')
        .between([id, new Date(0)], [id, new Date()])
        .last(),
    [id]
  )

  return (
    <Link
      href={`/checkin/${id}`}
      className={cn(
        'group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-all',
        'hover:border-primary/40 hover:shadow-sm hover:-translate-y-px active:translate-y-0 active:shadow-none'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-semibold text-foreground leading-tight">
            {inst.shortName}
          </span>
          {isCasual && (
            <span className="text-xs text-muted-foreground">Quick check-in</span>
          )}
        </div>
        <span
          aria-hidden="true"
          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-none transition-colors group-hover:bg-primary/20"
        >
          <ArrowRight size={15} />
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {isCasual
          ? inst.recallWindow
          : inst.description.split('.')[0] + '.'}
      </p>

      <div className="flex items-center justify-between gap-2 mt-auto">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={11} />
          {minutes === 1 ? '~1 min' : `~${minutes} min`}
        </span>
        {latest !== undefined && latest !== null && (
          <span className="text-xs text-muted-foreground">
            Last: {formatRelativeTime(
              latest.timestamp instanceof Date ? latest.timestamp : new Date(latest.timestamp)
            )}
            {latest.score !== null && latest.score !== undefined && (
              <span className="ml-1 font-semibold text-foreground">{latest.score}</span>
            )}
          </span>
        )}
      </div>
    </Link>
  )
}

// ─── Main home client ─────────────────────────────────────────────────────────

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 pt-10 pb-4 max-w-lg mx-auto w-full">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">MindMeter</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your mental health over time.
        </p>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 pb-10 max-w-lg mx-auto w-full flex flex-col gap-8">
        {/* Recent check-ins (only shown when data exists) */}
        <RecentCheckins />

        {/* Instrument groups */}
        {INSTRUMENT_GROUPS.map((group) => (
          <section key={group.label} aria-labelledby={`group-${group.label}`}>
            <h2
              id={`group-${group.label}`}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3"
            >
              {group.label}
            </h2>
            <div className={cn(
              'grid gap-3',
              group.ids.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            )}>
              {group.ids.map((id) => (
                <InstrumentCard key={id} id={id} />
              ))}
            </div>
          </section>
        ))}

        {/* Footer note */}
        <div className="flex flex-col items-center gap-2 pb-2">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            All data stays on your device. Nothing is sent to any server.
          </p>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <a href="/notes/new" className="underline hover:text-foreground">Quick note</a>
            Settings →{' '}
            <Link
              href="/help"
              className="underline hover:text-foreground transition-colors"
            >
              Get help
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
