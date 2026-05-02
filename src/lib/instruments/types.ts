export type ResponseScale = {
  value: number
  label: string
  description?: string
}

export type Question = {
  key: string
  text: string
  scale: ResponseScale[]
  isCritical?: boolean
}

export type SeverityBand = {
  min: number
  max: number
  label: string
  description: string
  color: 'minimal' | 'mild' | 'moderate' | 'severe'
}

export type Instrument = {
  id: 'phq2' | 'gad2' | 'phq9' | 'gad7' | 'who5' | 'sleep' | 'stress'
  name: string
  shortName: string
  description: string
  recallWindow: string
  estimatedSeconds: number
  questions: Question[]
  scoring: (responses: Record<string, number>) => number
  severityBands: SeverityBand[]
  attribution: string
  validatedFor: string
}
