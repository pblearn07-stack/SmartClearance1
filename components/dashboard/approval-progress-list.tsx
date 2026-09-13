import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { approvalProgress } from "@/lib/data"
import { statusBadge, progressTone } from "@/lib/status"
import { cn } from "@/lib/utils"

export function ApprovalProgressList() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Active approval progress</CardTitle>
          <p className="text-sm text-muted-foreground">Live status across departments</p>
        </div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowUpRight className="size-4" />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {approvalProgress.map((a) => {
          const isQuery = a.status === "Query Raised"
          return (
            <Link
              key={a.id}
              href="/applications"
              className={cn(
                "group flex flex-col gap-2.5 rounded-xl border p-3.5 transition-all card-hover",
                isQuery
                  ? "border-warning/50 bg-warning-muted/20 hover:border-warning"
                  : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {a.name}
                  </span>
                  <Badge variant={statusBadge(a.status)} className="shadow-2xs">
                    {a.status}
                  </Badge>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{a.department}</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={a.progress} tone={progressTone(a.status)} className="h-2 flex-1" />
                <span className="w-10 text-right text-xs font-bold text-foreground">
                  {a.progress}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Submitted: {a.submitted}</span>
                <span className={cn("font-medium", isQuery ? "text-warning-foreground font-semibold" : "")}>
                  Expected: {a.expected}
                </span>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
