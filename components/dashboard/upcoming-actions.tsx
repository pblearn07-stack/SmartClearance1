"use client"

import { FileText, MessageSquareWarning, ClipboardCheck, RefreshCw, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { upcomingActions, type UpcomingAction } from "@/lib/data"

const iconMap: Record<UpcomingAction["type"], LucideIcon> = {
  document: FileText,
  query: MessageSquareWarning,
  inspection: ClipboardCheck,
  renewal: RefreshCw,
}

const priorityVariant = {
  high: "danger",
  medium: "warning",
  low: "neutral",
} as const

export function UpcomingActions() {
  const { toast } = useToast()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming actions</CardTitle>
        <p className="text-sm text-muted-foreground">Deadlines and pending tasks</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {upcomingActions.map((a) => {
          const Icon = iconMap[a.type]
          return (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-lg border border-border/70 p-3 transition-colors hover:bg-muted/40"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">Due {a.due}</p>
              </div>
              <Badge variant={priorityVariant[a.priority]} className="capitalize">
                {a.priority}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast({ title: "Action started", description: a.title, tone: "info" })}
              >
                Resolve
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
