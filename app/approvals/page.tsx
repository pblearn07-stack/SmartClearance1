"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Search,
  Clock,
  Building,
  FileText,
  CheckCircle2,
  ArrowRight,
  Compass,
  Info,
  IndianRupee,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Tabs } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Drawer, Modal } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/components/ui/toast"
import { discoverApprovals, company, type Approval } from "@/lib/data"

const statusVariant = {
  Required: "danger",
  Recommended: "warning",
  "Not Applicable": "neutral",
} as const

const categoryVariant = {
  Mandatory: "info",
  Conditional: "warning",
  Optional: "neutral",
} as const

const departments = ["All departments", ...Array.from(new Set(discoverApprovals.map((a) => a.department)))]

const quickChips = [
  { id: "all", label: "All Clearances" },
  { id: "mandatory", label: "🔴 Mandatory Only" },
  { id: "fast", label: "⚡ Fast-Track (<20 Days)" },
  { id: "env", label: "🌿 Pollution & Environment" },
  { id: "labour", label: "👷 Labour & Worker Safety" },
]

export default function ApprovalsPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [dept, setDept] = useState("All departments")
  const [tab, setTab] = useState("all")
  const [quickChip, setQuickChip] = useState("all")
  const [selected, setSelected] = useState<Approval | null>(null)
  const [applyingFor, setApplyingFor] = useState<Approval | null>(null)

  const filtered = useMemo(() => {
    return discoverApprovals.filter((a) => {
      const matchesQuery =
        !query ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.department.toLowerCase().includes(query.toLowerCase())
      const matchesDept = dept === "All departments" || a.department === dept
      const matchesTab =
        tab === "all" ||
        (tab === "required" && a.status === "Required") ||
        (tab === "recommended" && a.status === "Recommended") ||
        (tab === "mandatory" && a.category === "Mandatory")
      const matchesChip =
        quickChip === "all" ||
        (quickChip === "mandatory" && a.category === "Mandatory") ||
        (quickChip === "fast" && (a.processing.includes("7") || a.processing.includes("15"))) ||
        (quickChip === "env" && (a.department.toLowerCase().includes("pollution") || a.department.toLowerCase().includes("seiaa"))) ||
        (quickChip === "labour" && (a.department.toLowerCase().includes("labour") || a.department.toLowerCase().includes("fire")))
      return matchesQuery && matchesDept && matchesTab && matchesChip
    })
  }, [query, dept, tab, quickChip])

  const counts = {
    all: discoverApprovals.length,
    required: discoverApprovals.filter((a) => a.status === "Required").length,
    recommended: discoverApprovals.filter((a) => a.status === "Recommended").length,
    mandatory: discoverApprovals.filter((a) => a.category === "Mandatory").length,
  }

  return (
    <div>
      <PageHeader
        title="Discover Approvals"
        description="Based on your industry profile, here are the approvals relevant to your business — no more guessing which department to approach."
      />

      <DemoBanner>
        <span className="font-semibold">Smart discovery:</span> These approvals are auto-matched to
        Raj Industries&apos; profile (Manufacturing · Automobile Components · Medium MSME · Madhya
        Pradesh). Demo data only.
      </DemoBanner>

      <Card className="mb-6 border-primary/20 bg-accent/30">
        <CardContent className="flex items-start gap-3 p-5">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {counts.required} mandatory approvals identified for your business
            </p>
            <p className="text-sm text-muted-foreground">
              Complete these to operate legally. Recommended approvals may apply based on planned
              expansion.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "all", label: "All", count: counts.all },
            { value: "required", label: "Required", count: counts.required },
            { value: "recommended", label: "Recommended", count: counts.recommended },
            { value: "mandatory", label: "Mandatory", count: counts.mandatory },
          ]}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search approvals..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 sm:w-64"
            />
          </div>
          <Select value={dept} onChange={(e) => setDept(e.target.value)} className="sm:w-56">
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Filters:</span>
        {quickChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setQuickChip(chip.id)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-all border",
              quickChip === chip.id
                ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                : "bg-muted/60 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Compass} title="No approvals found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <Card key={a.id} className="flex flex-col transition-all card-hover border border-border/80 hover:border-primary/40 shadow-xs">
              <CardContent className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={categoryVariant[a.category]}>{a.category}</Badge>
                  <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground text-balance">{a.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building className="size-3.5" />
                    {a.department}
                  </p>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{a.purpose}</p>
                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="size-3.5 text-primary" />
                    {a.processing}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <IndianRupee className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    {a.fees}
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="size-3.5 text-muted-foreground" />
                    {a.renewal}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelected(a)}>
                    Details
                  </Button>
                  <Button size="sm" className="flex-1 shadow-xs" onClick={() => setApplyingFor(a)}>
                    Apply Online
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        description={selected?.department}
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                const item = selected
                setSelected(null)
                if (item) setApplyingFor(item)
              }}
            >
              Apply Online Now
              <ArrowRight className="size-4" />
            </Button>
          </>
        }
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant={categoryVariant[selected.category]}>{selected.category}</Badge>
              <Badge variant={statusVariant[selected.status]}>{selected.status}</Badge>
            </div>

            <div className="rounded-lg border border-primary/20 bg-accent/30 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide">
                <Info className="size-3.5" />
                Why this is required
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">{selected.whyRequired}</p>
            </div>

            <DetailRow label="Purpose" value={selected.purpose} />
            <DetailRow label="Issuing authority" value={selected.authority} />
            <div className="grid grid-cols-3 gap-3">
              <MiniStat icon={Clock} label="Processing" value={selected.processing} />
              <MiniStat icon={IndianRupee} label="Fees" value={selected.fees} />
              <MiniStat icon={RefreshCw} label="Renewal" value={selected.renewal} />
            </div>

            <ListBlock icon={CheckCircle2} title="Eligibility criteria" items={selected.eligibility} />
            <ListBlock icon={FileText} title="Documents required" items={selected.documents} />

            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Application process</p>
              <ol className="flex flex-col gap-2">
                {selected.steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Drawer>

      {/* Single-Window Clearance Application Modal */}
      <Modal
        open={!!applyingFor}
        onClose={() => setApplyingFor(null)}
        title={applyingFor ? `Single-Window Application: ${applyingFor.name}` : ""}
        description={applyingFor ? `Issuing Authority: ${applyingFor.authority}` : ""}
        footer={
          <>
            <Button variant="outline" onClick={() => setApplyingFor(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!applyingFor) return
                const name = applyingFor.name
                const deptName = applyingFor.department
                setApplyingFor(null)
                toast({
                  title: "Application Submitted Successfully",
                  description: `${name} has been filed with ${deptName} under Single-Window Clearance (ID: SWC-2026-${Math.floor(1000 + Math.random() * 9000)}).`,
                  tone: "success",
                })
              }}
            >
              Submit Clearance Application
              <ArrowRight className="size-4" />
            </Button>
          </>
        }
      >
        {applyingFor && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-2.5">
              <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Single-Window Digital Submission</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your corporate master data and verified documents from Document Vault will be auto-attached.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/40 p-3 rounded-lg border border-border">
              <div>
                <p className="text-xs text-muted-foreground">Applicant Enterprise</p>
                <p className="font-semibold text-foreground">{company.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Registration / CIN</p>
                <p className="font-mono text-xs font-semibold text-foreground">{company.registrationNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Unit Location</p>
                <p className="font-semibold text-foreground">{company.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Application Fee</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">{applyingFor.fees}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1.5">Required Documents Checklist</p>
              <div className="flex flex-col gap-1.5 border border-border rounded-lg p-3 bg-card">
                {applyingFor.documents.map((doc) => (
                  <div key={doc} className="flex items-center gap-2 text-xs text-foreground">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>{doc}</span>
                    <span className="ml-auto text-[10px] text-emerald-600 font-semibold uppercase">Auto-attached</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{value}</p>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/40 p-3">
      <Icon className="size-4 text-muted-foreground" />
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold text-foreground">{value}</p>
    </div>
  )
}

function ListBlock({ icon: Icon, title, items }: { icon: typeof FileText; title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <Icon className="size-4 text-primary" />
        {title}
      </p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/50" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
