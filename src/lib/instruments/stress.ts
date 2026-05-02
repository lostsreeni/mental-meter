import type { Instrument } from './types'

const SLIDER_SCALE = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: String(i),
}))

export const stress: Instrument = {
  id: 'stress',
  name: 'Stress Level Check-in',
  shortName: 'Stress',
  description:
    'A quick informal check-in about current stress. This is not a validated clinical instrument — it provides a personal reference point, not a clinical assessment.',
  recallWindow: 'Right now…',
  estimatedSeconds: 20,
  questions: [
    {
      key: 'stress_q1',
      text: 'How stressed do you feel right now?',
      scale: SLIDER_SCALE,
    },
  ],
  scoring: (responses) => responses['stress_q1'] ?? 0,
  severityBands: [
    {
      min: 0,
      max: 3,
      label: 'Low',
      color: 'minimal',
      description:
        'Scores in this range suggest stress is currently low.',
    },
    {
      min: 4,
      max: 6,
      label: 'Moderate',
      color: 'mild',
      description:
        'Scores in this range suggest a moderate level of current stress.',
    },
    {
      min: 7,
      max: 10,
      label: 'High',
      color: 'severe',
      description:
        'Scores in this range suggest current stress is high. Persistent high stress may be worth discussing with a healthcare provider.',
    },
  ],
  attribution: 'Quick check-in — not a clinical scale.',
  validatedFor: 'Not a validated clinical instrument',
}
