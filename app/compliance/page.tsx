"use client"

import { useMemo, useState } from "react"
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, ListChecks } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs } from "@/components/ui/tabs"
import { CircularProgress } from "@/components/ui/circular-progress"
import { useToast } from "@/components/ui/toast"
import {
  complianceScore,
  complianceCategories,
  complianceTasks,
  type ComplianceTask,
} from "@/lib/data"
import { complianceStatusBadge } from "@/lib/status"
import { cn } from "@/lib/utils"

const tabDefs = [
  { value: "all", label: "All" },
  { value: "Due Soon", label: "Due Soon" },
  { value: "Pending", label: "Pending" },
  { value: "Overdue", label: "Overdue" },
  { value: "Completed", label: "Completed" },
]

export default function CompliancePage() {
  const { toast } = useToast()
  const [tab, setTab] = useState("all")

  const filteredTasks = useMemo(
    () => (tab === "all" ? complianceTasks : complianceTasks.filter((t) => t.status === tab)),
    [tab],
  )

  const completed = complianceTasks.filter((t) => t.status === "Completed").length
  const dueSoon = complianceTasks.filter((t) => t.status === "Due Soon").length
  const overdue = complianceTasks.filter((t) => t.status === "Overdue").length

  return (
    <div>
      <PageHeader
        title="Compliance Monitor"
        description="Continuous tracking of every legal obligation — so you stay audit-ready and never miss a renewal or filing."
      />

      <DemoBanner />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Overall compliance</CardTitle>
            <p className="text-sm text-muted-foreground">Weighted across all categories</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <CircularProgress
              value={complianceScore}
              tone="success"
              sublabel="Compliance score"
            />
            <div className="grid w-full grid-cols-3 gap-2 text-center">
              <MiniStat value={completed} label="Completed" tone="success" icon={CheckCircle2} />
              <MiniStat value={dueSoon} label="Due soon" tone="warning" icon={Clock} />
              <MiniStat value={overdue} label="Overdue" tone="danger" icon={AlertTriangle} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compliance by category</CardTitle>
            <p className="text-sm text-muted-foreground">Health score for each compliance area</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {complianceCategories.map((c) => (
              <div key={c.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{c.name}</span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      c.score >= 90 ? "text-success" : c.score >= 75 ? "text-info" : "text-warning-foreground",
                    )}
                  >
                    {c.score}%
                  </span>
                </div>
                <Progress
                  value={c.score}
                  tone={c.score >= 90 ? "success" : c.score >= 75 ? "primary" : "warning"}
                />
                <div className="flex gap-3 text-[11px] text-muted-foreground">
                  <span>{c.completed} completed</span>
                  {c.dueSoon > 0 && <span className="text-warning-foreground">{c.dueSoon} due soon</span>}
                  {c.overdue > 0 && <span className="text-destructive">{c.overdue} overdue</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="size-4 text-primary" />
              Compliance tasks
            </CardTitle>
            <p className="text-sm text-muted-foreground">Obligations, renewals, and filings</p>
          </div>
          <Tabs value={tab} onChange={setTab} tabs={tabDefs} />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {filteredTasks.map((t) => (
            <TaskRow key={t.id} task={t} onAction={() => toast({ title: "Task opened", description: t.title, tone: "info" })} />
          ))}
          {filteredTasks.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No tasks in this category.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MiniStat({
  value,
  label,
  tone,
  icon: Icon,
}: {
  value: number
  label: string
  tone: "success" | "warning" | "danger"
  icon: typeof CheckCircle2
}) {
  const toneClass = {
    success: "text-success",
    warning: "text-warning-foreground",
    danger: "text-destructive",
  }[tone]
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg border border-border bg-muted/40 p-2.5">
      <Icon className={cn("size-4", toneClass)} />
      <span className="text-lg font-bold text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  )
}

function TaskRow({ task, onAction }: { task: ComplianceTask; onAction: () => void }) {
  const done = task.status === "Completed"
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/70 p-3 transition-colors hover:bg-muted/40">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          done ? "bg-success-muted text-success" : "bg-muted text-muted-foreground",
        )}
      >
        {done ? <CheckCircle2 className="size-4.5" /> : <Clock className="size-4.5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-medium", done ? "text-muted-foreground line-through" : "text-foreground")}>
          {task.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {task.category} · Due {task.due}
        </p>
      </div>
      <Badge variant={complianceStatusBadge(task.status)}>{task.status}</Badge>
      {!done && (
        <Button size="sm" variant="outline" onClick={onAction}>
          Action
        </Button>
      )}
    </div>
  )
}
