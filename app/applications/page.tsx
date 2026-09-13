"use client"

import { useMemo, useState } from "react"
import {
  Search,
  FileStack,
  Building,
  CalendarDays,
  CheckCircle2,
  Circle,
  MessageSquareWarning,
  ArrowRight,
  Plus,
  AlertTriangle,
  Upload,
  FileText,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Drawer, Modal } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/components/ui/toast"
import { applications, type Application, type Status } from "@/lib/data"
import { statusBadge, progressTone } from "@/lib/status"
import { cn } from "@/lib/utils"

const tabDefs: { value: string; label: string; match: (s: Status) => boolean }[] = [
  { value: "all", label: "All", match: () => true },
  { value: "active", label: "Active", match: (s) => ["Submitted", "Under Review", "Query Raised"].includes(s) },
  { value: "query", label: "Query Raised", match: (s) => s === "Query Raised" },
  { value: "approved", label: "Approved", match: (s) => s === "Approved" },
  { value: "draft", label: "Drafts", match: (s) => s === "Draft" },
]

export default function ApplicationsPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState("all")
  const [selected, setSelected] = useState<Application | null>(null)
  const [queryModalApp, setQueryModalApp] = useState<Application | null>(null)
  const [queryRemark, setQueryRemark] = useState("")
  const [attachedFile, setAttachedFile] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const def = tabDefs.find((t) => t.value === tab)!
    return applications.filter(
      (a) =>
        def.match(a.status) &&
        (!query ||
          a.approval.toLowerCase().includes(query.toLowerCase()) ||
          a.id.toLowerCase().includes(query.toLowerCase())),
    )
  }, [query, tab])

  return (
    <div>
      <PageHeader
        title="My Applications"
        description="Track every submitted approval in real time — status, timeline, and next steps in one place."
        actions={
          <Button
            onClick={() => toast({ title: "New application", description: "Pick an approval from Discover to begin.", tone: "info" })}
          >
            <Plus className="size-4" />
            New application
          </Button>
        }
      />

      <DemoBanner />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={tabDefs.map((t) => ({
            value: t.value,
            label: t.label,
            count: applications.filter((a) => t.match(a.status)).length,
          }))}
        />
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 lg:w-72"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileStack} title="No applications here" description="Applications matching this filter will appear here." />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((a) => {
            const isQuery = a.status === "Query Raised"
            return (
              <Card
                key={a.id}
                className={cn(
                  "transition-all card-hover border",
                  isQuery ? "border-warning/50 bg-warning-muted/15 shadow-xs" : "border-border/80 shadow-2xs hover:border-primary/40",
                )}
              >
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-foreground">{a.approval}</h3>
                        <Badge variant={statusBadge(a.status)} className="shadow-2xs">
                          {a.status}
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground">#{a.id}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium">
                          <Building className="size-3.5" />
                          {a.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="size-3.5" />
                          Submitted {a.submitted}
                        </span>
                        <span className={cn("font-medium", isQuery ? "text-warning-foreground font-semibold" : "")}>
                          Expected: {a.expected}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 lg:w-64">
                      <div className="flex-1">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-bold text-foreground">{a.progress}%</span>
                        </div>
                        <Progress value={a.progress} tone={progressTone(a.status)} className="h-2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isQuery && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setQueryModalApp(a)}
                          className="shadow-xs"
                        >
                          <MessageSquareWarning className="size-3.5" />
                          Resolve Query
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => setSelected(a)}>
                        Track
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Query Notice Banner for Query Raised items */}
                  {isQuery && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 rounded-lg border border-warning/40 bg-warning-muted/40 px-3.5 py-2.5 text-xs text-warning-foreground">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="size-4 shrink-0 text-warning-foreground" />
                        <span className="font-medium">
                          Scrutiny Query: Department requested revised emission load calculations & air monitoring data.
                        </span>
                      </div>
                      <button
                        onClick={() => setQueryModalApp(a)}
                        className="font-semibold underline hover:opacity-80 shrink-0"
                      >
                        Reply now &rarr;
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.approval}
        description={selected ? `#${selected.id} · ${selected.department}` : undefined}
        footer={
          selected?.status === "Query Raised" ? (
            <Button
              onClick={() => {
                const app = selected
                setSelected(null)
                if (app) setQueryModalApp(app)
              }}
            >
              <MessageSquareWarning className="size-4" />
              Respond to Query
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
          )
        }
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Current status</p>
                <Badge variant={statusBadge(selected.status)} className="mt-1">
                  {selected.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Expected decision</p>
                <p className="text-sm font-semibold text-foreground">{selected.expected}</p>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Overall progress</span>
                <span className="font-semibold text-foreground">{selected.progress}%</span>
              </div>
              <Progress value={selected.progress} tone={progressTone(selected.status)} />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">Application timeline</p>
              <ol className="relative flex flex-col">
                {selected.timeline.map((t, i) => {
                  const isLast = i === selected.timeline.length - 1
                  return (
                    <li key={i} className="flex gap-3 pb-5 last:pb-0">
                      <div className="flex flex-col items-center">
                        {t.done ? (
                          <CheckCircle2 className="size-5 text-success" />
                        ) : (
                          <Circle className="size-5 text-muted-foreground/40" />
                        )}
                        {!isLast && (
                          <span className={cn("mt-1 w-px flex-1", t.done ? "bg-success/40" : "bg-border")} />
                        )}
                      </div>
                      <div className="-mt-0.5 pb-1">
                        <p className={cn("text-sm font-medium", t.done ? "text-foreground" : "text-muted-foreground")}>
                          {t.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                        {t.note && (
                          <p className="mt-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{t.note}</p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        )}
      </Drawer>

      {/* Query Resolution Modal */}
      <Modal
        open={!!queryModalApp}
        onClose={() => setQueryModalApp(null)}
        title={queryModalApp ? `Respond to Query: ${queryModalApp.approval}` : ""}
        description={queryModalApp ? `Application #${queryModalApp.id} · ${queryModalApp.department}` : ""}
        footer={
          <>
            <Button variant="outline" onClick={() => setQueryModalApp(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!queryModalApp) return
                const title = queryModalApp.approval
                setQueryModalApp(null)
                setQueryRemark("")
                setAttachedFile(null)
                toast({
                  title: "Query Response Submitted",
                  description: `Your response and uploaded documents for ${title} were sent to the review officer.`,
                  tone: "success",
                })
              }}
            >
              Submit Response to Officer
              <ArrowRight className="size-4" />
            </Button>
          </>
        }
      >
        {queryModalApp && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="rounded-lg border border-warning/30 bg-warning-muted/30 p-3.5">
              <p className="text-xs font-bold uppercase tracking-wider text-warning-foreground">Official Scrutiny Note</p>
              <p className="mt-1 text-xs text-foreground leading-relaxed">
                &ldquo;Please submit the latest stack emission test report and certified layout diagram specifying pollution abatement equipment installed at Pithampur Unit II.&rdquo;
              </p>
              <p className="mt-1.5 text-[11px] text-muted-foreground">— Regional Officer, MPPCB (Dhar Division)</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Your Written Clarification / Remarks</label>
              <textarea
                rows={3}
                value={queryRemark}
                onChange={(e) => setQueryRemark(e.target.value)}
                placeholder="Enter explanation or reply to the inspecting officer..."
                className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Upload Supporting Document (PDF / JPG)</label>
              <div
                onClick={() => setAttachedFile("Stack_Air_Quality_Report_Oct2026.pdf")}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
              >
                {attachedFile ? (
                  <div className="flex items-center gap-2 text-primary font-medium text-xs">
                    <FileText className="size-4" />
                    <span>{attachedFile}</span>
                    <Badge variant="success" className="text-[10px]">Ready to upload</Badge>
                  </div>
                ) : (
                  <>
                    <Upload className="size-6 text-muted-foreground mb-1" />
                    <p className="text-xs font-medium text-foreground">Click to attach document</p>
                    <p className="text-[11px] text-muted-foreground">e.g. Stack_Air_Quality_Report_Oct2026.pdf (Max 10MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
