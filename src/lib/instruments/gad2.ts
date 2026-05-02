import type { Instrument } from './types'

const FREQUENCY_SCALE = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
]

export const gad2: Instrument = {
  id: 'gad2',
  name: 'Generalized Anxiety Disorder Scale-2',
  shortName: 'GAD-2',
  description:
    'A 2-item ultra-brief anxiety screen derived from the first two items of the GAD-7. A score ≥3 suggests further evaluation with the full GAD-7 is warranted.',
  recallWindow: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
  estimatedSeconds: 45,
  questions: [
    {
      key: 'gad2_q1',
      text: 'Feeling nervous, anxious, or on edge',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'gad2_q2',
      text: 'Not being able to stop or control worrying',
      scale: FREQUENCY_SCALE,
    },
  ],
  scoring: (responses) =>
    Object.values(responses).reduce((sum, v) => sum + v, 0),
  severityBands: [
    {
      min: 0,
      max: 2,
      label: 'Below threshold',
      color: 'minimal',
      description:
        'Scores in this range suggest anxiety disorder is unlikely. Routine monitoring may still be appropriate.',
    },
    {
      min: 3,
      max: 6,
      label: 'At or above threshold',
      color: 'moderate',
      description:
        'Scores of 3 or higher suggest further evaluation with the full GAD-7 is warranted.',
    },
  ],
  attribution:
    'Kroenke K, Spitzer RL, Williams JBW, Monahan PO, Löwe B. Anxiety disorders in primary care: prevalence, impairment, comorbidity, and detection. Ann Intern Med. 2007;146(5):317-325. © Pfizer Inc. Free for use.',
  validatedFor: 'Adults 18+',
}
