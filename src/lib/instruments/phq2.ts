import type { Instrument } from './types'

const FREQUENCY_SCALE = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
]

export const phq2: Instrument = {
  id: 'phq2',
  name: 'Patient Health Questionnaire-2',
  shortName: 'PHQ-2',
  description:
    'A 2-item ultra-brief depression screen derived from the first two items of the PHQ-9. Used as an initial screen; a score ≥3 suggests further evaluation with the full PHQ-9 is warranted.',
  recallWindow: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
  estimatedSeconds: 45,
  questions: [
    {
      key: 'phq2_q1',
      text: 'Little interest or pleasure in doing things',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'phq2_q2',
      text: 'Feeling down, depressed, or hopeless',
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
        'Scores in this range suggest depression is unlikely. Routine monitoring may still be appropriate.',
    },
    {
      min: 3,
      max: 6,
      label: 'At or above threshold',
      color: 'moderate',
      description:
        'Scores of 3 or higher suggest further evaluation with the full PHQ-9 is warranted.',
    },
  ],
  attribution:
    'Kroenke K, Spitzer RL, Williams JBW. The Patient Health Questionnaire-2: Validity of a two-item depression screener. Med Care. 2003;41(11):1284-1292. © Pfizer Inc. Free for use.',
  validatedFor: 'Adults 18+',
}
