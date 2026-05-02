import { phq2 } from './phq2'
import { phq9 } from './phq9'
import { gad2 } from './gad2'
import { gad7 } from './gad7'
import { who5 } from './who5'
import { sleep } from './sleep'
import { stress } from './stress'

export type { Instrument, Question, ResponseScale, SeverityBand } from './types'

export const instruments = {
  phq2,
  phq9,
  gad2,
  gad7,
  who5,
  sleep,
  stress,
} as const

export type InstrumentId = keyof typeof instruments

export function getInstrument(id: InstrumentId) {
  const instrument = instruments[id]
  if (!instrument) {
    throw new Error(`Unknown instrument: "${id}"`)
  }
  return instrument
}

export function getSeverityBand(instrument: (typeof instruments)[InstrumentId], score: number) {
  const band = instrument.severityBands.find(
    (b) => score >= b.min && score <= b.max
  )
  if (!band) {
    throw new Error(
      `Score ${score} is out of range for instrument "${instrument.id}" (expected ${instrument.severityBands[0].min}–${instrument.severityBands[instrument.severityBands.length - 1].max})`
    )
  }
  return band
}
