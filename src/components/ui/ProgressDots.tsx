import { cn } from "@/lib/utils"

interface ProgressDotsProps {
  total: number
  current: number
  className?: string
}

function ProgressDots({ total, current, className }: ProgressDotsProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            "rounded-full transition-all duration-200",
            i === current
              ? "w-6 h-2.5 bg-primary"
              : i < current
              ? "w-2.5 h-2.5 bg-primary/40"
              : "w-2.5 h-2.5 bg-border"
          )}
        />
      ))}
    </div>
  )
}

export { ProgressDots }
