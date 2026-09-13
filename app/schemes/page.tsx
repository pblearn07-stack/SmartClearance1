"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Landmark,
  Sparkles,
  CalendarClock,
  Building2,
  CheckCircle2,
  ArrowRight,
  Gift,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Modal } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/components/ui/toast"
import { schemes, type Scheme } from "@/lib/data"
import { cn } from "@/lib/utils"

const sortOptions = ["Best match", "Deadline (soonest)", "Name (A–Z)"]

function matchTone(match: number) {
  if (match >= 85) return "success"
  if (match >= 70) return "info"
  return "warning"
}

export default function SchemesPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("Best match")
  const [selected, setSelected] = useState<Scheme | null>(null)

  const list = useMemo(() => {
    const filtered = schemes.filter(
      (s) =>
        !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.department.toLowerCase().includes(query.toLowerCase()),
    )
    return [...filtered].sort((a, b) => {
      if (sort === "Best match") return b.match - a.match
      if (sort === "Name (A–Z)") return a.name.localeCompare(b.name)
      return a.deadline.localeCompare(b.deadline)
    })
  }, [query, sort])

  const topMatch = schemes.reduce((max, s) => (s.match > max.match ? s : max), schemes[0])

  return (
    <div>
      <PageHeader
        title="Government Schemes"
        description="Personalized subsidy, incentive, and support programs matched to your industry profile — so you never miss a benefit you qualify for."
      />

      <DemoBanner />

      <Card className="mb-6 border-primary/20 bg-gradient-to-r from-accent/50 to-card">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Top match: {topMatch.name} ({topMatch.match}%)
              </p>
              <p className="text-sm text-muted-foreground">
                {schemes.length} schemes matched to Raj Industries · Manufacturing MSME · Madhya Pradesh
              </p>
            </div>
          </div>
          <Button onClick={() => setSelected(topMatch)}>
            View top match
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search schemes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 sm:w-72"
          />
        </div>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-52">
          {sortOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </Select>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Landmark} title="No schemes found" description="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => (
            <Card key={s.id} className="flex flex-col transition-shadow hover:shadow-md">
              <CardContent className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Gift className="size-5" />
                  </div>
                  <Badge variant={matchTone(s.match)}>{s.match}% match</Badge>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground text-balance">{s.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="size-3.5" />
                    {s.department}
                  </p>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                <div className="mt-auto flex flex-col gap-2 border-t border-border pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Benefit</span>
                    <span className="text-right font-medium text-foreground">{s.estBenefit}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <CalendarClock className="size-3.5" />
                      Deadline
                    </span>
                    <span className="font-medium text-foreground">{s.deadline}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setSelected(s)}>
                  View details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
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
                toast({
                  title: "Application initiated",
                  description: `${selected?.name} — eligibility check started.`,
                  tone: "success",
                })
                setSelected(null)
              }}
            >
              Apply for scheme
              <ArrowRight className="size-4" />
            </Button>
          </>
        }
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={matchTone(selected.match)}>{selected.match}% profile match</Badge>
              <Badge variant="neutral">{selected.benefitType}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{selected.description}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Estimated benefit</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{selected.estBenefit}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Application deadline</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{selected.deadline}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <CheckCircle2 className="size-4 text-primary" />
                Eligibility criteria
              </p>
              <ul className="flex flex-col gap-1.5">
                {selected.eligibility.map((e) => (
                  <li key={e} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/50")} />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
