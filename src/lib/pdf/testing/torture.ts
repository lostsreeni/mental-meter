import type { InstrumentId } from '@/lib/instruments'

export type TortureScenario = {
  name: string
  checkinCount: number
  instruments: InstrumentId[]
  q9Elevated?: boolean
  allSkipped?: boolean
  longNotes?: boolean
  unicodeNotes?: boolean
}

export const TORTURE_SCENARIOS: TortureScenario[] = [
  { name: 'single-checkin-phq2', checkinCount: 1, instruments: ['phq2'] },
  { name: 'seven-checkins-phq9', checkinCount: 7, instruments: ['phq9'], q9Elevated: true },
  { name: 'hundred-checkins-all', checkinCount: 100, instruments: ['phq2','phq9','gad2','gad7','who5','sleep','stress'] },
  { name: 'thousand-checkins-all', checkinCount: 1000, instruments: ['phq2','phq9','gad2','gad7','who5','sleep','stress'] },
  { name: 'all-skipped', checkinCount: 30, instruments: ['phq9'], allSkipped: true },
  { name: 'long-notes-unicode', checkinCount: 20, instruments: ['gad7'], longNotes: true, unicodeNotes: true },
]

export function tortureChecklist() {
  return [
    'Open outputs in Adobe Acrobat, macOS Preview, Chrome PDF viewer, and one mobile PDF viewer.',
    'Print black-and-white and verify mild/moderate/severe bands remain distinguishable.',
    'Verify 90-day all-instrument report stays under 1MB.',
  ]
}
