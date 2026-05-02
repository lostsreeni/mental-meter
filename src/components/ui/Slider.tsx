"use client"

import { cn } from "@/lib/utils"

interface SliderProps {
  id?: string
  label?: string
  min?: number
  max?: number
  step?: number
  value: number
  onChange: (value: number) => void
  minLabel?: string
  maxLabel?: string
  className?: string
  disabled?: boolean
}

function Slider({
  id,
  label,
  min = 0,
  max = 10,
  step = 1,
  value,
  onChange,
  minLabel,
  maxLabel,
  className,
  disabled = false,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-lg font-medium text-foreground leading-relaxed"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center h-14">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted disabled:opacity-50 disabled:cursor-not-allowed
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-7
            [&::-webkit-slider-thumb]:h-7
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:active:scale-95
            [&::-moz-range-thumb]:w-7
            [&::-moz-range-thumb]:h-7
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:border-none
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-pointer
            focus-visible:outline-none
            focus-visible:[&::-webkit-slider-thumb]:ring-2
            focus-visible:[&::-webkit-slider-thumb]:ring-ring"
          style={{
            background: `linear-gradient(to right, var(--primary) ${percentage}%, var(--muted) ${percentage}%)`,
          }}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>

      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{minLabel}</span>
          <span className="text-sm font-semibold text-primary">{value}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  )
}

export { Slider }
