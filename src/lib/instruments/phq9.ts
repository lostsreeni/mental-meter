import type { Instrument } from './types'

const FREQUENCY_SCALE = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
]

export const phq9: Instrument = {
  id: 'phq9',
  name: 'Patient Health Questionnaire-9',
  shortName: 'PHQ-9',
  description:
    'A 9-item depression scale derived from the Primary Care Evaluation of Mental Disorders (PRIME-MD). Widely used in primary care and research settings to screen for and measure the severity of depression.',
  recallWindow: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
  estimatedSeconds: 180,
  questions: [
    {
      key: 'phq9_q1',
      text: 'Little interest or pleasure in doing things',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'phq9_q2',
      text: 'Feeling down, depressed, or hopeless',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'phq9_q3',
      text: 'Trouble falling or staying asleep, or sleeping too much',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'phq9_q4',
      text: 'Feeling tired or having little energy',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'phq9_q5',
      text: 'Poor appetite or overeating',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'phq9_q6',
      text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'phq9_q7',
      text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'phq9_q8',
      text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
      scale: FREQUENCY_SCALE,
    },
    {
      key: 'phq9_q9',
      text: 'Thoughts that you would be better off dead, or of hurting yourself in some way',
      scale: FREQUENCY_SCALE,
      isCritical: true,
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
        'Scores in this range typically do not require treatment. Watchful waiting may be appropriate.',
    },
    {
      min: 5,
      max: 9,
      label: 'Mild',
      color: 'mild',
      description:
        'Scores in this range suggest watchful waiting. Repeat assessment in a few weeks is often recommended.',
    },
    {
      min: 10,
      max: 14,
      label: 'Moderate',
      color: 'moderate',
      description:
        'Scores in this range are where treatment with counseling, therapy, or medication is often considered.',
    },
    {
      min: 15,
      max: 19,
      label: 'Moderately Severe',
      color: 'moderate',
      description:
        'Scores in this range are associated with significant impairment; active treatment with psychotherapy and/or medication is often considered.',
    },
    {
      min: 20,
      max: 27,
      label: 'Severe',
      color: 'severe',
      description:
        'Scores in this range are associated with substantial functional impairment; active treatment is typically recommended.',
    },
  ],
  attribution:
    'Kroenke K, Spitzer RL, Williams JBW. The PHQ-9: Validity of a brief depression severity measure. J Gen Intern Med. 2001;16(9):606-613. © Pfizer Inc. Free for use.',
  validatedFor: 'Adults 18+',
}
