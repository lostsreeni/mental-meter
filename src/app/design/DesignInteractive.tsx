"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/Slider"
import { RadioGroup } from "@/components/ui/RadioGroup"

export default function DesignInteractive() {
  const [sliderValue, setSliderValue] = useState(5)
  const [radioValue, setRadioValue] = useState("")

  const moodOptions = [
    { value: "none", label: "Not at all", description: "Score 0–1" },
    { value: "mild", label: "Several days", description: "Score 2–3" },
    { value: "moderate", label: "More than half the days", description: "Score 4–5" },
    { value: "severe", label: "Nearly every day", description: "Score 6–7" },
  ]

  return (
    <>
      {/* Slider */}
      <section aria-labelledby="slider-heading">
        <h2 id="slider-heading" className="text-xl font-semibold text-foreground mb-4">Slider</h2>
        <div className="space-y-6">
          <Slider
            id="sleep-hours"
            label="How many hours did you sleep last night?"
            min={0}
            max={12}
            step={0.5}
            value={sliderValue}
            onChange={setSliderValue}
            minLabel="0 hrs"
            maxLabel="12 hrs"
          />
          <Slider
            id="stress-level"
            label="Stress level today"
            min={0}
            max={10}
            step={1}
            value={7}
            onChange={() => {}}
            minLabel="None"
            maxLabel="Extreme"
            disabled
          />
        </div>
      </section>

      {/* Radio Group */}
      <section aria-labelledby="radio-heading">
        <h2 id="radio-heading" className="text-xl font-semibold text-foreground mb-4">Radio Group</h2>
        <RadioGroup
          id="phq-frequency"
          legend="Over the past 2 weeks, how often have you had little interest or pleasure in doing things?"
          options={moodOptions}
          value={radioValue}
          onChange={setRadioValue}
        />
      </section>
    </>
  )
}
