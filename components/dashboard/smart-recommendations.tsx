import { Sparkles, FileUp, MessageSquare, CalendarClock, FileSearch, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { smartRecommendations } from "@/lib/data"

const iconMap: Record<string, LucideIcon> = {
  document: FileUp,
  query: MessageSquare,
  inspection: CalendarClock,
  review: FileSearch,
}

export function SmartRecommendations() {
  return (
    <Card className="border-primary/20 bg-gradient-to-b from-accent/40 to-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          AI recommendations
        </CardTitle>
        <p className="text-sm text-muted-foreground">Suggested next best actions</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {smartRecommendations.map((r) => {
          const Icon = iconMap[r.type] ?? Sparkles
          return (
            <div key={r.id} className="flex items-start gap-3 rounded-lg bg-card/70 p-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.detail}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
