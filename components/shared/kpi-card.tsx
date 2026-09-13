import Link from "next/link"
import { TrendingUp, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const toneStyles = {
  info: "bg-info-muted text-info",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning-foreground",
  default: "bg-primary/10 text-primary",
} as const

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "default",
  href,
}: {
  label: string
  value: string | number
  delta?: string
  icon: LucideIcon
  tone?: keyof typeof toneStyles
  href?: string
}) {
  const content = (
    <Card className="p-5 card-hover relative overflow-hidden transition-all border border-border/80 shadow-xs hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={cn("flex size-11 items-center justify-center rounded-xl shadow-xs", toneStyles[tone])}>
          <Icon className="size-5.5" />
        </div>
      </div>
      {delta && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <TrendingUp className="size-3.5 text-success" />
          <span>{delta}</span>
        </div>
      )}
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    )
  }

  return content
}

