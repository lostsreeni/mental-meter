import { describe, it, expect } from 'vitest'
import { TORTURE_SCENARIOS, tortureChecklist } from './torture'

describe('pdf torture definitions', () => {
  it('includes required scenario sizes', () => {
    const sizes = TORTURE_SCENARIOS.map(s => s.checkinCount)
    expect(sizes).toContain(1)
    expect(sizes).toContain(7)
    expect(sizes).toContain(100)
    expect(sizes).toContain(1000)
  })

  it('includes checklist guidance', () => {
    expect(tortureChecklist().length).toBeGreaterThanOrEqual(3)
  })
})
