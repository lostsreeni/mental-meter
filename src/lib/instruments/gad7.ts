import type { Instrument } from './types'

const FREQUENCY_SCALE = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
]

export const gad7: Instrument = {
  id: 'gad7',
  name: 'Generalized Anxiety Disorder Scale-7',
  shortName: 'GAD-7',
  description:
    'A 7-item anxiety scale developed to screen for and measure the severity of generalized anxiety disorder. Also shows good sensitivity for panic disorder, social anxiety disorder, and post-traumatic stress disorder.',
  recallWindow: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
  estimatedSeconds: 150,
  questions: [
    {
      key: 'gad7_q1',
      text: 'Feeling nervous, anxious, or on edge',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'gad7_q2',
      text: 'Not being able to stop or control worrying',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'gad7_q3',
      text: 'Worrying too much about different things',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'gad7_q4',
      text: 'Trouble relaxing',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'gad7_q5',
      text: "Being so restless that it's hard to sit still",
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'gad7_q6',
      text: 'Becoming easily annoyed or irritable',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'gad7_q7',
      text: 'Feeling afraid as if something awful might happen',
      scale: FREQUENCY_SCALE,
    },
  ],
  scoring: (responses) =>
    Object.values(responses).reduce((sum, v) => sum + v, 0),
  severityBands: [
    {
      min: 0,
      max: 4,
      label: 'Minimal',
      color: 'minimal',
      description:
        'Scores in this range suggest minimal anxiety symptoms. Routine monitoring may be appropriate.',
    },
    {
      min: 5,
      max: 9,
      label: 'Mild',
      color: 'mild',
      description:
        'Scores in this range suggest mild anxiety. Watchful waiting and repeat assessment are often recommended.',
    },
    {
      min: 10,
      max: 14,
      label: 'Moderate',
      color: 'moderate',
      description:
        'Scores in this range suggest moderate anxiety; further evaluation and possible treatment are often considered.',
    },
    {
      min: 15,
      max: 21,
      label: 'Severe',
      color: 'severe',
      description:
        'Scores in this range suggest severe anxiety; active treatment is typically recommended.',
    },
  ],
  resultContext: {
    overview: 'This is a screening tool, not a diagnosis.',
    trends: 'Scores can vary day to day; trends matter more than single results.',
    elevated: 'Consider sharing this with a healthcare provider or therapist.',
  },
  attribution:
    'Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder. Arch Intern Med. 2006;166(10):1092-1097. © Pfizer Inc. Free for use.',
  validatedFor: 'Adults 18+',
}
