import type { Instrument } from './types'

const SLIDER_SCALE = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: String(i),
}))

export const sleep: Instrument = {
  id: 'sleep',
  name: 'Sleep Quality Check-in',
  shortName: 'Sleep',
  description:
    'A quick informal check-in about last night\'s sleep. This is not a validated clinical instrument — it provides a personal reference point, not a clinical assessment.',
  recallWindow: 'Thinking about last night…',
  estimatedSeconds: 20,
  questions: [
    {
      key: 'sleep_q1',
      text: 'How would you rate your sleep last night?',
      scale: SLIDER_SCALE,
    },
  ],
  scoring: (responses) => responses['sleep_q1'] ?? 0,
  severityBands: [
    {
      min: 0,
      max: 3,
      label: 'Poor',
      color: 'severe',
      description:
        'Scores in this range suggest last night\'s sleep was poor. Persistent poor sleep may be worth discussing with a healthcare provider.',
    },
    {
      min: 4,
      max: 6,
      label: 'Fair',
      color: 'mild',
      description:
        'Scores in this range suggest last night\'s sleep was fair.',
    },
    {
      min: 7,
      max: 10,
      label: 'Good',
      color: 'minimal',
      description:
        'Scores in this range suggest last night\'s sleep was good.',
    },
  ],
  resultContext: {
    overview: 'This is a screening tool, not a diagnosis.',
    trends: 'Scores can vary day to day; trends matter more than single results.',
    elevated: 'Consider sharing this with a healthcare provider or therapist.',
  },
  attribution: 'Quick check-in — not a clinical scale.',
  validatedFor: 'Not a validated clinical instrument',
}
