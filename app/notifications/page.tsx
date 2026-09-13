"use client"

import { useState } from "react"
import {
  Bell,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  RefreshCw,
  CheckCheck,
  type LucideIcon,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs } from "@/components/ui/tabs"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/components/ui/toast"
import { notifications as initial, type Notification, type NotificationType } from "@/lib/data"
import { cn } from "@/lib/utils"

const typeConfig: Record<NotificationType, { icon: LucideIcon; className: string; label: string }> = {
  status: { icon: RefreshCw, className: "bg-info-muted text-info", label: "Status" },
  document: { icon: FileText, className: "bg-warning-muted text-warning-foreground", label: "Document" },
  compliance: { icon: ShieldCheck, className: "bg-destructive/10 text-destructive", label: "Compliance" },
  approval: { icon: CheckCircle2, className: "bg-success-muted text-success", label: "Approval" },
  scheme: { icon: Landmark, className: "bg-primary/10 text-primary", label: "Scheme" },
}

const tabDefs = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "status", label: "Status" },
  { value: "compliance", label: "Compliance" },
  { value: "document", label: "Documents" },
]

export default function NotificationsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Notification[]>(initial)
  const [tab, setTab] = useState("all")

  const filtered = items.filter((n) => {
    if (tab === "all") return true
    if (tab === "unread") return !n.read
    return n.type === tab
  })

  const unread = items.filter((n) => !n.read).length

  const markAll = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
    toast({ title: "All caught up", description: "All notifications marked as read.", tone: "success" })
  }

  const toggle = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)))

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Real-time alerts for status changes, expiring documents, compliance deadlines, and new scheme matches."
        actions={
          <Button variant="outline" onClick={markAll} disabled={unread === 0}>
            <CheckCheck className="size-4" />
            Mark all read
          </Button>
        }
      />

      <DemoBanner />

      <div className="mb-5 flex items-center justify-between">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={tabDefs.map((t) => ({
            ...t,
            count:
              t.value === "all"
                ? items.length
                : t.value === "unread"
                  ? unread
                  : items.filter((n) => n.type === t.value).length,
          }))}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up in this category." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((n) => {
            const config = typeConfig[n.type]
            const Icon = config.icon
            return (
              <Card key={n.id} className={cn("transition-colors", !n.read && "border-primary/30 bg-accent/20")}>
                <CardContent className="flex items-start gap-3 p-4">
                  <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", config.className)}>
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{n.title}</p>
                      <Badge variant="neutral">{config.label}</Badge>
                      {!n.read && <span className="size-2 rounded-full bg-primary" aria-label="Unread" />}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.detail}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggle(n.id)}>
                    {n.read ? "Mark unread" : "Mark read"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
