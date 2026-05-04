import type { Instrument } from './types'

export const who5: Instrument = {
  id: 'who5',
  name: 'WHO-5 Well-Being Index',
  shortName: 'WHO-5',
  description:
    'A 5-item measure of current mental well-being. The score is converted to a 0–100 index. Scores ≤50 indicate poor well-being; scores ≤28 suggest possible depression and are commonly used as a trigger to administer the PHQ-9.',
  recallWindow: 'Please indicate for each of the five statements which is closest to how you have been feeling over the last two weeks.',
  estimatedSeconds: 90,
  questions: [
    {
      key: 'who5_q1',
      text: 'I have felt cheerful and in good spirits',
      scale: [
        { value: 0, label: 'At no time' },
        { value: 1, label: 'Some of the time' },
        { value: 2, label: 'Less than half of the time' },
        { value: 3, label: 'More than half of the time' },
        { value: 4, label: 'Most of the time' },
        { value: 5, label: 'All of the time' },
      ],
    },
    {
      key: 'who5_q2',
      text: 'I have felt calm and relaxed',
      scale: [
        { value: 0, label: 'At no time' },
        { value: 1, label: 'Some of the time' },
        { value: 2, label: 'Less than half of the time' },
        { value: 3, label: 'More than half of the time' },
        { value: 4, label: 'Most of the time' },
        { value: 5, label: 'All of the time' },
      ],
    },
    {
      key: 'who5_q3',
      text: 'I have felt active and vigorous',
      scale: [
        { value: 0, label: 'At no time' },
        { value: 1, label: 'Some of the time' },
        { value: 2, label: 'Less than half of the time' },
        { value: 3, label: 'More than half of the time' },
        { value: 4, label: 'Most of the time' },
        { value: 5, label: 'All of the time' },
      ],
    },
    {
      key: 'who5_q4',
      text: 'I woke up feeling fresh and rested',
      scale: [
        { value: 0, label: 'At no time' },
        { value: 1, label: 'Some of the time' },
        { value: 2, label: 'Less than half of the time' },
        { value: 3, label: 'More than half of the time' },
        { value: 4, label: 'Most of the time' },
        { value: 5, label: 'All of the time' },
      ],
    },
    {
      key: 'who5_q5',
      text: 'My daily life has been filled with things that interest me',
      scale: [
        { value: 0, label: 'At no time' },
        { value: 1, label: 'Some of the time' },
        { value: 2, label: 'Less than half of the time' },
        { value: 3, label: 'More than half of the time' },
        { value: 4, label: 'Most of the time' },
        { value: 5, label: 'All of the time' },
      ],
    },
  ],
  // Raw sum (0–25) multiplied by 4 to yield 0–100 index
  scoring: (responses) =>
    Object.values(responses).reduce((sum, v) => sum + v, 0) * 4,
  severityBands: [
    {
      min: 0,
      max: 28,
      label: 'Poor well-being',
      color: 'severe',
      description:
        'Scores in this range suggest possible depression and are commonly used as a trigger to administer the PHQ-9 for further assessment.',
    },
    {
      min: 29,
      max: 50,
      label: 'Below average well-being',
      color: 'moderate',
      description:
        'Scores in this range indicate below-average well-being. Monitoring and self-care strategies may be beneficial.',
    },
    {
      min: 51,
      max: 100,
      label: 'Good well-being',
      color: 'minimal',
      description:
        'Scores in this range reflect good subjective well-being.',
    },
  ],
  resultContext: {
    overview: 'This is a screening tool, not a diagnosis.',
    trends: 'Scores can vary day to day; trends matter more than single results.',
    elevated: 'Consider sharing this with a healthcare provider or therapist.',
  },
  attribution:
    'WHO (1998). Wellbeing measures in primary health care: the DepCare project. Copenhagen: WHO Regional Office for Europe. © World Health Organization. Free for use.',
  validatedFor: 'Adults 18+',
}
