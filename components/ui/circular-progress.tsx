import { cn } from "@/lib/utils"

export function CircularProgress({
  value,
  size = 140,
  stroke = 12,
  tone = "primary",
  label,
  sublabel,
  className,
}: {
  value: number
  size?: number
  stroke?: number
  tone?: "primary" | "success" | "warning" | "danger"
  label?: React.ReactNode
  sublabel?: React.ReactNode
  className?: string
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference
  const colorVar =
    tone === "success"
      ? "var(--success)"
      : tone === "warning"
        ? "var(--warning)"
        : tone === "danger"
          ? "var(--destructive)"
          : "var(--primary)"

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorVar}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label ?? <span className="text-2xl font-bold text-foreground">{value}%</span>}
        {sublabel && <span className="mt-0.5 text-xs text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  )
}
