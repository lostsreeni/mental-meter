import type { PDFBuilder } from '../generator'

type Note = { timestamp: Date | string; content: string; tags?: string[]; checkinId?: number | null }
type Checkin = { id?: number; type: string; score: number | null; severityBand: string | null }

function fmt(d: Date) { return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }

export function addJournalNotesSection(builder: PDFBuilder, notes: Note[], checkinsById: Map<number, Checkin>) {
  if (!notes.length) return
  builder.addPageBreakIfNeeded(30)
  builder.addHeading('Journal Notes', 2)
  builder.addParagraph('Notes the user attached to their check-ins or recorded standalone, in chronological order.', { muted: true })
  builder.addSpacer(2)

  const sorted = [...notes].sort((a,b)=>+new Date(a.timestamp)-+new Date(b.timestamp))
  for (const n of sorted) {
    const linked = n.checkinId ? checkinsById.get(n.checkinId) : null
    const label = linked ? `${linked.type.toUpperCase()} = ${linked.score ?? '—'} (${linked.severityBand ?? '—'})` : 'Standalone note'
    builder.addPageBreakIfNeeded(22)
    builder.addParagraph(`${fmt(new Date(n.timestamp))} — ${label}`, { muted: !!linked })
    if (n.tags?.length) builder.addParagraph(`Tags: ${n.tags.join(', ')}`, { muted: true })
    const parts = n.content.split('\n')
    for (const p of parts) {
      builder.addPageBreakIfNeeded(8)
      builder.addParagraph(p || ' ')
    }
    builder.addParagraph('─────', { muted: true })
  }
}
