"use client"

import { cn } from "@/lib/utils"

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  id?: string
  legend?: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

function RadioGroup({
  id,
  legend,
  options,
  value,
  onChange,
  className,
  disabled = false,
}: RadioGroupProps) {
  return (
    <fieldset className={cn("border-none p-0 m-0", className)}>
      {legend && (
        <legend className="text-lg font-medium text-foreground leading-relaxed mb-3">
          {legend}
        </legend>
      )}
      <div className="flex flex-col gap-2" role="radiogroup">
        {options.map((option) => {
          const isSelected = value === option.value
          const inputId = id ? `${id}-${option.value}` : `radio-${option.value}`
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={cn(
                "flex items-center gap-4 min-h-[3rem] px-4 py-3 rounded-xl border cursor-pointer transition-all select-none",
                "hover:bg-accent hover:border-primary/40",
                isSelected
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-background text-foreground",
                disabled && "opacity-50 cursor-not-allowed pointer-events-none"
              )}
            >
              <input
                type="radio"
                id={inputId}
                name={id ?? "radio-group"}
                value={option.value}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {/* Custom radio indicator */}
              <span
                aria-hidden="true"
                className={cn(
                  "flex-none w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-border bg-background"
                )}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </span>
              <span className="flex flex-col">
                <span className="font-medium text-base">{option.label}</span>
                {option.description && (
                  <span className="text-sm text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export { RadioGroup }
export type { RadioOption }
