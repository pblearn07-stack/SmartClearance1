import Link from "next/link"
import { FileStack, CheckCircle2, Clock, ShieldCheck, Compass, ArrowRight, AlertTriangle, ArrowUpRight } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { KpiCard } from "@/components/shared/kpi-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WorkflowOverview } from "@/components/dashboard/workflow-overview"
import { ApprovalProgressList } from "@/components/dashboard/approval-progress-list"
import { UpcomingActions } from "@/components/dashboard/upcoming-actions"
import { SmartRecommendations } from "@/components/dashboard/smart-recommendations"
import { ComplianceTrendChart } from "@/components/charts"
import { company } from "@/lib/data"

const kpiIcons = [FileStack, CheckCircle2, Clock, ShieldCheck]

const kpiData = [
  { label: "Active Approvals", value: 5, delta: "+2 this quarter", tone: "info" as const, href: "/applications" },
  { label: "Completed Approvals", value: 12, delta: "+3 this year", tone: "success" as const, href: "/applications" },
  { label: "Pending Actions", value: 4, delta: "2 need attention", tone: "warning" as const, href: "/compliance" },
  { label: "Compliance Score", value: "87%", delta: "+4% vs last month", tone: "success" as const, href: "/analytics" },
]

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title={`Welcome back, ${company.name.split(" ")[0]} Industries`}
        description="Your unified command center for industrial approvals, documents, and compliance."
        actions={
          <>
            <Button variant="outline" render={<Link href="/applications" />}>
              My Applications
            </Button>
            <Button render={<Link href="/approvals" />}>
              <Compass className="size-4" />
              Discover Approvals
            </Button>
          </>
        }
      />

      {/* Action Required Alert Banner */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-warning/40 bg-warning-muted/40 p-4 text-warning-foreground shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning/20 text-warning-foreground mt-0.5">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-warning-foreground">Action Required</span>
              <Badge variant="warning" className="text-[10px] px-1.5 py-0">Due in 2 days</Badge>
            </div>
            <p className="text-sm font-semibold text-foreground mt-0.5">
              Pollution Control Board (MPPCB) query response pending
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Please upload the requested Stack Air Quality Monitoring Report to avoid clearance review delay.
            </p>
          </div>
        </div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all shrink-0"
        >
          <span>Respond to Query</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <DemoBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((k, i) => (
          <KpiCard key={k.label} {...k} icon={kpiIcons[i]} />
        ))}
      </div>

      <div className="mt-6">
        <WorkflowOverview />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ApprovalProgressList />
          <UpcomingActions />
        </div>
        <div className="flex flex-col gap-6">
          <SmartRecommendations />
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Compliance trend</CardTitle>
                <p className="text-sm text-muted-foreground">Last 6 months</p>
              </div>
              <Link href="/analytics" className="text-sm font-medium text-primary hover:underline">
                Details
              </Link>
            </CardHeader>
            <CardContent>
              <ComplianceTrendChart />
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex flex-col gap-3 p-5">
              <ShieldCheck className="size-6" />
              <div>
                <p className="text-base font-semibold">Single-window clearance</p>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  SmartClearance consolidates 20+ department approvals into one guided workflow —
                  cutting redundant paperwork and delays.
                </p>
              </div>
              <Button
                variant="secondary"
                className="w-fit"
                render={<Link href="/approvals" />}
              >
                Explore approvals
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
