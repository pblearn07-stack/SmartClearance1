import { BarChart3, TrendingUp, Clock, FileWarning, PieChart } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KpiCard } from "@/components/shared/kpi-card"
import {
  ProcessingTimeChart,
  StatusDonut,
  ComplianceTrendChart,
  PendingTrendChart,
  DocumentExpiryChart,
  ChartLegend,
} from "@/components/charts"
import { statusDistribution } from "@/lib/data"

const kpis = [
  { label: "Avg. processing time", value: "52 days", delta: "-8 days vs last quarter", tone: "info" as const, icon: Clock },
  { label: "On-time approval rate", value: "84%", delta: "+6% improvement", tone: "success" as const, icon: TrendingUp },
  { label: "Total applications", value: 22, delta: "+5 this year", tone: "default" as const, icon: BarChart3 },
  { label: "Docs expiring (90d)", value: 6, delta: "Plan renewals early", tone: "warning" as const, icon: FileWarning },
]

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics & Insights"
        description="A data-driven view of your approval performance, compliance trajectory, and document health."
      />

      <DemoBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Average processing time by approval</CardTitle>
            <p className="text-sm text-muted-foreground">How long each approval type typically takes</p>
          </CardHeader>
          <CardContent>
            <ProcessingTimeChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="size-4 text-primary" />
              Application status
            </CardTitle>
            <p className="text-sm text-muted-foreground">Current distribution</p>
          </CardHeader>
          <CardContent>
            <StatusDonut />
            <div className="mt-2">
              <ChartLegend items={statusDistribution} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Compliance score trend</CardTitle>
            <p className="text-sm text-muted-foreground">6-month trajectory</p>
          </CardHeader>
          <CardContent>
            <ComplianceTrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending items trend</CardTitle>
            <p className="text-sm text-muted-foreground">Backlog reducing over time</p>
          </CardHeader>
          <CardContent>
            <PendingTrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document expiry forecast</CardTitle>
            <p className="text-sm text-muted-foreground">Upcoming 6 months</p>
          </CardHeader>
          <CardContent>
            <DocumentExpiryChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
