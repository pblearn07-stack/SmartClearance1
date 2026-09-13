import { cn } from "@/lib/utils"

type Tone = "primary" | "success" | "warning" | "danger"

const toneMap: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
}

export function Progress({
  value,
  tone = "primary",
  className,
}: {
  value: number
  tone?: Tone
  className?: string
}) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", toneMap[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
