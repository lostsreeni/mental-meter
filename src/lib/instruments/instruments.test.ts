import { describe, it, expect } from 'vitest'
import { phq9 } from './phq9'
import { phq2 } from './phq2'
import { gad7 } from './gad7'
import { gad2 } from './gad2'
import { who5 } from './who5'
import { sleep } from './sleep'
import { stress } from './stress'
import { getSeverityBand, getInstrument, instruments } from './index'

// Helpers
function responses(instrument: { questions: { key: string }[] }, values: number[]) {
  return Object.fromEntries(
    instrument.questions.map((q, i) => [q.key, values[i]])
  )
}

// ─── PHQ-9 ───────────────────────────────────────────────────────────────────
describe('PHQ-9 scoring', () => {
  it('scores all-zero as 0', () => {
    expect(phq9.scoring(responses(phq9, [0, 0, 0, 0, 0, 0, 0, 0, 0]))).toBe(0)
  })

  it('scores all-three as 27', () => {
    expect(phq9.scoring(responses(phq9, [3, 3, 3, 3, 3, 3, 3, 3, 3]))).toBe(27)
  })

  it('sums a mixed profile correctly', () => {
    // 1+2+1+2+1+0+1+0+0 = 8
    expect(phq9.scoring(responses(phq9, [1, 2, 1, 2, 1, 0, 1, 0, 0]))).toBe(8)
  })

  it('q9 is flagged isCritical', () => {
    expect(phq9.questions.find((q) => q.key === 'phq9_q9')?.isCritical).toBe(true)
  })

  it('no other question is flagged isCritical', () => {
    const criticalQuestions = phq9.questions.filter((q) => q.isCritical)
    expect(criticalQuestions).toHaveLength(1)
  })
})

describe('PHQ-9 severity bands', () => {
  it('score 0 → Minimal', () => {
    expect(getSeverityBand(phq9, 0).label).toBe('Minimal')
  })

  it('score 4 → Minimal (upper boundary)', () => {
    expect(getSeverityBand(phq9, 4).label).toBe('Minimal')
  })

  it('score 5 → Mild (lower boundary)', () => {
    expect(getSeverityBand(phq9, 5).label).toBe('Mild')
  })

  it('score 9 → Mild (upper boundary)', () => {
    expect(getSeverityBand(phq9, 9).label).toBe('Mild')
  })

  it('score 10 → Moderate', () => {
    expect(getSeverityBand(phq9, 10).label).toBe('Moderate')
  })

  it('score 14 → Moderate (upper boundary)', () => {
    expect(getSeverityBand(phq9, 14).label).toBe('Moderate')
  })

  it('score 15 → Moderately Severe', () => {
    expect(getSeverityBand(phq9, 15).label).toBe('Moderately Severe')
  })

  it('score 20 → Severe', () => {
    expect(getSeverityBand(phq9, 20).label).toBe('Severe')
  })

  it('score 27 → Severe (maximum)', () => {
    expect(getSeverityBand(phq9, 27).label).toBe('Severe')
  })
})

// ─── PHQ-2 ───────────────────────────────────────────────────────────────────
describe('PHQ-2 scoring', () => {
  it('scores all-zero as 0', () => {
    expect(phq2.scoring(responses(phq2, [0, 0]))).toBe(0)
  })

  it('scores all-three as 6', () => {
    expect(phq2.scoring(responses(phq2, [3, 3]))).toBe(6)
  })

  it('2+1 = 3 (at threshold)', () => {
    expect(phq2.scoring(responses(phq2, [2, 1]))).toBe(3)
  })
})

describe('PHQ-2 severity bands', () => {
  it('score 2 → Below threshold', () => {
    expect(getSeverityBand(phq2, 2).label).toBe('Below threshold')
  })

  it('score 3 → At or above threshold (cutoff)', () => {
    expect(getSeverityBand(phq2, 3).label).toBe('At or above threshold')
  })

  it('score 6 → At or above threshold (maximum)', () => {
    expect(getSeverityBand(phq2, 6).label).toBe('At or above threshold')
  })
})

// ─── GAD-7 ───────────────────────────────────────────────────────────────────
describe('GAD-7 scoring', () => {
  it('scores all-zero as 0', () => {
    expect(gad7.scoring(responses(gad7, [0, 0, 0, 0, 0, 0, 0]))).toBe(0)
  })

  it('scores all-three as 21', () => {
    expect(gad7.scoring(responses(gad7, [3, 3, 3, 3, 3, 3, 3]))).toBe(21)
  })

  it('sums a mixed profile correctly', () => {
    // 2+2+1+1+1+0+0 = 7
    expect(gad7.scoring(responses(gad7, [2, 2, 1, 1, 1, 0, 0]))).toBe(7)
  })
})

describe('GAD-7 severity bands', () => {
  it('score 0 → Minimal', () => {
    expect(getSeverityBand(gad7, 0).label).toBe('Minimal')
  })

  it('score 4 → Minimal (upper boundary)', () => {
    expect(getSeverityBand(gad7, 4).label).toBe('Minimal')
  })

  it('score 5 → Mild', () => {
    expect(getSeverityBand(gad7, 5).label).toBe('Mild')
  })

  it('score 10 → Moderate', () => {
    expect(getSeverityBand(gad7, 10).label).toBe('Moderate')
  })

  it('score 15 → Severe', () => {
    expect(getSeverityBand(gad7, 15).label).toBe('Severe')
  })

  it('score 21 → Severe (maximum)', () => {
    expect(getSeverityBand(gad7, 21).label).toBe('Severe')
  })
})

// ─── GAD-2 ───────────────────────────────────────────────────────────────────
describe('GAD-2 scoring', () => {
  it('scores all-zero as 0', () => {
    expect(gad2.scoring(responses(gad2, [0, 0]))).toBe(0)
  })

  it('scores all-three as 6', () => {
    expect(gad2.scoring(responses(gad2, [3, 3]))).toBe(6)
  })

  it('1+2 = 3 (at threshold)', () => {
    expect(gad2.scoring(responses(gad2, [1, 2]))).toBe(3)
  })
})

describe('GAD-2 severity bands', () => {
  it('score 2 → Below threshold', () => {
    expect(getSeverityBand(gad2, 2).label).toBe('Below threshold')
  })

  it('score 3 → At or above threshold', () => {
    expect(getSeverityBand(gad2, 3).label).toBe('At or above threshold')
  })
})

// ─── WHO-5 ───────────────────────────────────────────────────────────────────
describe('WHO-5 scoring', () => {
  it('all-zero raw sum 0 → index 0', () => {
    expect(who5.scoring(responses(who5, [0, 0, 0, 0, 0]))).toBe(0)
  })

  it('all-five raw sum 25 → index 100', () => {
    expect(who5.scoring(responses(who5, [5, 5, 5, 5, 5]))).toBe(100)
  })

  it('raw sum 7 → index 28 (depression screening cutoff)', () => {
    // e.g. [2,2,1,1,1] = 7 × 4 = 28
    expect(who5.scoring(responses(who5, [2, 2, 1, 1, 1]))).toBe(28)
  })

  it('raw sum 13 → index 52', () => {
    // [3,3,3,2,2] = 13 × 4 = 52
    expect(who5.scoring(responses(who5, [3, 3, 3, 2, 2]))).toBe(52)
  })

  it('multiplies by 4, not just sums', () => {
    // raw sum 5 → must be 20, not 5
    expect(who5.scoring(responses(who5, [1, 1, 1, 1, 1]))).toBe(20)
  })
})

describe('WHO-5 severity bands', () => {
  it('score 0 → Poor well-being', () => {
    expect(getSeverityBand(who5, 0).label).toBe('Poor well-being')
  })

  it('score 28 → Poor well-being (upper cutoff boundary)', () => {
    expect(getSeverityBand(who5, 28).label).toBe('Poor well-being')
  })

  it('score 29 → Below average well-being', () => {
    expect(getSeverityBand(who5, 29).label).toBe('Below average well-being')
  })

  it('score 50 → Below average well-being (upper boundary)', () => {
    expect(getSeverityBand(who5, 50).label).toBe('Below average well-being')
  })

  it('score 51 → Good well-being', () => {
    expect(getSeverityBand(who5, 51).label).toBe('Good well-being')
  })

  it('score 100 → Good well-being (maximum)', () => {
    expect(getSeverityBand(who5, 100).label).toBe('Good well-being')
  })
})

// ─── Sleep ───────────────────────────────────────────────────────────────────
describe('Sleep scoring', () => {
  it('passes the slider value through unchanged', () => {
    expect(sleep.scoring({ sleep_q1: 7 })).toBe(7)
    expect(sleep.scoring({ sleep_q1: 0 })).toBe(0)
    expect(sleep.scoring({ sleep_q1: 10 })).toBe(10)
  })

  it('defaults to 0 when key is missing', () => {
    expect(sleep.scoring({})).toBe(0)
  })
})

describe('Sleep severity bands', () => {
  it('score 0 → Poor', () => {
    expect(getSeverityBand(sleep, 0).label).toBe('Poor')
  })

  it('score 3 → Poor (upper boundary)', () => {
    expect(getSeverityBand(sleep, 3).label).toBe('Poor')
  })

  it('score 4 → Fair', () => {
    expect(getSeverityBand(sleep, 4).label).toBe('Fair')
  })

  it('score 7 → Good', () => {
    expect(getSeverityBand(sleep, 7).label).toBe('Good')
  })

  it('score 10 → Good (maximum)', () => {
    expect(getSeverityBand(sleep, 10).label).toBe('Good')
  })
})

// ─── Stress ──────────────────────────────────────────────────────────────────
describe('Stress scoring', () => {
  it('passes the slider value through unchanged', () => {
    expect(stress.scoring({ stress_q1: 5 })).toBe(5)
    expect(stress.scoring({ stress_q1: 0 })).toBe(0)
    expect(stress.scoring({ stress_q1: 10 })).toBe(10)
  })

  it('defaults to 0 when key is missing', () => {
    expect(stress.scoring({})).toBe(0)
  })
})

describe('Stress severity bands', () => {
  it('score 0 → Low', () => {
    expect(getSeverityBand(stress, 0).label).toBe('Low')
  })

  it('score 4 → Moderate', () => {
    expect(getSeverityBand(stress, 4).label).toBe('Moderate')
  })

  it('score 7 → High', () => {
    expect(getSeverityBand(stress, 7).label).toBe('High')
  })

  it('score 10 → High (maximum)', () => {
    expect(getSeverityBand(stress, 10).label).toBe('High')
  })
})

// ─── Registry ─────────────────────────────────────────────────────────────────
describe('instrument registry', () => {
  it('contains all seven instruments', () => {
    expect(Object.keys(instruments)).toEqual(
      expect.arrayContaining(['phq2', 'phq9', 'gad2', 'gad7', 'who5', 'sleep', 'stress'])
    )
    expect(Object.keys(instruments)).toHaveLength(7)
  })

  it('getInstrument returns the correct instrument', () => {
    expect(getInstrument('phq9').id).toBe('phq9')
    expect(getInstrument('who5').id).toBe('who5')
  })

  it('getInstrument throws for an unknown id', () => {
    // @ts-expect-error intentional bad id
    expect(() => getInstrument('unknown')).toThrow()
  })

  it('every instrument has at least one question', () => {
    for (const inst of Object.values(instruments)) {
      expect(inst.questions.length).toBeGreaterThan(0)
    }
  })

  it('every question key is unique within its instrument', () => {
    for (const inst of Object.values(instruments)) {
      const keys = inst.questions.map((q) => q.key)
      expect(new Set(keys).size).toBe(keys.length)
    }
  })

  it('every instrument has at least one severity band', () => {
    for (const inst of Object.values(instruments)) {
      expect(inst.severityBands.length).toBeGreaterThan(0)
    }
  })

  it('severity bands are contiguous with no gaps', () => {
    for (const inst of Object.values(instruments)) {
      const bands = [...inst.severityBands].sort((a, b) => a.min - b.min)
      for (let i = 1; i < bands.length; i++) {
        expect(bands[i].min).toBe(bands[i - 1].max + 1)
      }
    }
  })
})
