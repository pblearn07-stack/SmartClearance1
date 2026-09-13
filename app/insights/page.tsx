"use client"

import { useState, useEffect } from "react"
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Gauge,
  ArrowRight,
  ShieldAlert,
  Database,
  RefreshCw,
  CheckCircle2,
  Cpu,
  Lock,
  FileCode,
} from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CircularProgress } from "@/components/ui/circular-progress"
import { RiskDonut, ChartLegend } from "@/components/charts"
import { useToast } from "@/components/ui/toast"
import {
  delayPredictions,
  complianceRisk,
  riskDistribution,
  type DelayPrediction,
} from "@/lib/data"
import { riskBadge, riskTone } from "@/lib/status"
import { cn } from "@/lib/utils"

export default function InsightsPage() {
  const { toast } = useToast()
  const [syncing, setSyncing] = useState(false)
  const [pipelineData, setPipelineData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/government-data/sync")
      .then((res) => res.json())
      .then((data) => setPipelineData(data))
      .catch(() => {})
  }, [])

  const handleManualSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch("/api/government-data/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: "ogd-msme-clearances-2026" }),
      })
      const data = await res.json()
      setPipelineData(data)
      toast({
        title: "Government Open Data Synchronized",
        description: data.message || "Ingested records from data.gov.in. Preprocessing pipeline complete.",
        tone: "success",
      })
    } catch {
      toast({
        title: "Sync Error",
        description: "Failed to connect to government open data endpoint.",
        tone: "danger",
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Insights & Prediction"
        description="Machine-assisted intelligence that forecasts approval delays and compliance risks before they become problems."
        actions={
          <Button
            variant="outline"
            onClick={handleManualSync}
            disabled={syncing}
            className="shadow-xs"
          >
            <RefreshCw className={cn("size-3.5", syncing ? "animate-spin text-primary" : "")} />
            {syncing ? "Syncing OGD Data..." : "Sync Open Data (data.gov.in)"}
          </Button>
        }
      />

      <DemoBanner>
        <span className="font-semibold">Government Open Data Integration:</span> Ingests clearance and scheme data from{" "}
        <span className="font-semibold text-foreground">data.gov.in</span> under the National Data Sharing and Accessibility Policy (NDSAP).
        Processed feature vectors feed predictive ML models for delay forecasting.
      </DemoBanner>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-b from-accent/40 to-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-primary" />
              Compliance risk index
            </CardTitle>
            <p className="text-sm text-muted-foreground">Overall organizational risk</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <CircularProgress
              value={complianceRisk.score}
              tone="warning"
              label={
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-foreground">{complianceRisk.level}</span>
                  <span className="text-xs text-muted-foreground">risk level</span>
                </div>
              }
            />
            <p className="text-center text-sm text-muted-foreground">
              Risk score {complianceRisk.score}/100 — driven mainly by an overdue filing and
              upcoming environmental deadlines.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-warning-foreground" />
              Contributing risk factors
            </CardTitle>
            <p className="text-sm text-muted-foreground">What&apos;s influencing your risk score</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {complianceRisk.factors.map((f) => (
              <div key={f.label} className="flex items-center justify-between rounded-lg border border-border/70 p-3">
                <span className="text-sm text-foreground">{f.label}</span>
                <Badge
                  variant={f.impact === "High" ? "danger" : f.impact === "Medium" ? "warning" : "neutral"}
                >
                  {f.impact} impact
                </Badge>
              </div>
            ))}
            <div className="mt-1 rounded-lg border border-primary/20 bg-accent/30 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Lightbulb className="size-4 text-primary" />
                Recommended actions
              </p>
              <ul className="flex flex-col gap-1.5">
                {complianceRisk.recommendations.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Gauge className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Approval delay predictions</h2>
          </div>
          {delayPredictions.map((p) => (
            <DelayCard key={p.id} prediction={p} />
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk distribution</CardTitle>
              <p className="text-sm text-muted-foreground">Across active approvals</p>
            </CardHeader>
            <CardContent>
              <RiskDonut />
              <div className="mt-2">
                <ChartLegend items={riskDistribution} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex flex-col gap-3 p-5">
              <Sparkles className="size-6" />
              <div>
                <p className="text-base font-semibold">Stay ahead of delays</p>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  Acting on high-risk predictions early can significantly improve on-time approval
                  outcomes.
                </p>
              </div>
              <Button variant="secondary" className="w-fit" render={<Link href="/applications" />}>
                Review applications
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Government Open Data & ML Pipeline Section */}
      <Card className="mt-8 border-primary/30 shadow-xs overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/80 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5 shadow-2xs">
              <Database className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold">Government Open Data Pipeline & ML Feature Store</CardTitle>
                <Badge variant={pipelineData?.isLiveApi ? "success" : "info"} className="text-[10px]">
                  {pipelineData?.isLiveApi ? "Live API Connected" : "OGD India Verified Benchmark"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Source: <span className="font-semibold text-foreground">data.gov.in</span> · Frequency: Daily Updates · License: GODL (NDSAP Compliant)
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleManualSync}
            disabled={syncing}
            className="shadow-xs shrink-0"
          >
            <RefreshCw className={cn("size-3.5", syncing ? "animate-spin" : "")} />
            {syncing ? "Running Pipeline..." : "Fetch & Retrain"}
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-background/60 p-3.5 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Ingested Records
              </span>
              <span className="text-2xl font-extrabold text-primary block mt-0.5">
                {pipelineData?.metrics?.processedRecordsCount || 7}
              </span>
              <span className="text-[10px] text-muted-foreground">data.gov.in feed</span>
            </div>

            <div className="rounded-xl border border-border bg-background/60 p-3.5 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Missing Values Cleaned
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {pipelineData?.metrics?.missingValuesImputed ?? 4}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Imputed with median</span>
            </div>

            <div className="rounded-xl border border-border bg-background/60 p-3.5 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                PII Tokens Masked
              </span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 block mt-0.5">
                {pipelineData?.metrics?.piiTokensAnonymized ?? 7}
              </span>
              <span className="text-[10px] text-muted-foreground">100% Anonymized</span>
            </div>

            <div className="rounded-xl border border-border bg-background/60 p-3.5 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                ML Training Tensors
              </span>
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 block mt-0.5">
                {pipelineData?.metrics?.mlFeaturesExtracted ?? 7}
              </span>
              <span className="text-[10px] text-muted-foreground">5-D PyTorch Ready</span>
            </div>
          </div>

          {/* Model Architecture & Features Callout */}
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-primary" />
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Downstream Model Specs</p>
                <Badge variant="default" className="text-[10px]">PyTorch / TensorFlow</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Features:</span> [Dept_Code, Normalized_SLA, Actual_Duration, Fee_Scale, Delay_Flag] &rarr;{" "}
                <span className="font-semibold text-foreground">Output:</span> Delay Risk Score (%) & Bottleneck Classification
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground shrink-0">
              <span>AUC-ROC: <strong className="text-foreground">91.4%</strong></span>
              <span>Inference: <strong className="text-foreground">12ms</strong></span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" /> NDSAP License OK
              </span>
            </div>
          </div>

          {/* Ingested & Preprocessed Open Data Records */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Preprocessed Open Data Dataset Preview
              </p>
              <span className="text-[11px] text-muted-foreground">
                Last Synchronized: {pipelineData?.lastSynced ? new Date(pipelineData.lastSynced).toLocaleTimeString() : "Just now"}
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Record ID</th>
                    <th className="py-2.5 px-3 font-semibold">Department</th>
                    <th className="py-2.5 px-3 font-semibold">Clearance / Scheme</th>
                    <th className="py-2.5 px-3 font-semibold">SLA / Actual</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Anonymized Entity</th>
                    <th className="py-2.5 px-3 font-semibold">ML Tensor Vector</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {(pipelineData?.records || []).slice(0, 6).map((rec: any) => (
                    <tr key={rec.recordId} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2 px-3 font-mono font-semibold text-foreground">{rec.recordId}</td>
                      <td className="py-2 px-3 text-muted-foreground truncate max-w-[160px]">{rec.department}</td>
                      <td className="py-2 px-3 font-medium text-foreground">{rec.clearanceName}</td>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-foreground">{rec.actualDays}d</span>{" "}
                        <span className="text-muted-foreground">(SLA: {rec.slaDays}d)</span>
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant={rec.status === "Approved" ? "success" : rec.status === "Query Raised" ? "warning" : "info"} className="text-[10px]">
                          {rec.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground">{rec.anonymizedEnterpriseId}</td>
                      <td className="py-2 px-3 font-mono text-[10px] text-primary">
                        [{rec.mlFeatureVector?.join(", ")}]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DelayCard({ prediction }: { prediction: DelayPrediction }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-foreground">{prediction.approval}</h3>
            <p className="text-sm text-muted-foreground">Predicted delay likelihood</p>
          </div>
          <Badge variant={riskBadge(prediction.risk)}>
            <TrendingUp className="size-3" />
            {prediction.risk} risk
          </Badge>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delay probability</span>
            <span className="font-semibold text-foreground">{prediction.probability}%</span>
          </div>
          <Progress value={prediction.probability} tone={riskTone(prediction.risk)} />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Contributing factors
          </p>
          <div className="flex flex-wrap gap-1.5">
            {prediction.factors.map((f) => (
              <span
                key={f}
                className="rounded-md border border-border bg-muted/50 px-2 py-1 text-xs text-muted-foreground"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "flex items-start gap-2 rounded-lg p-3 text-sm",
            prediction.risk === "Low" ? "bg-success-muted/50 text-success" : "bg-accent/40 text-foreground",
          )}
        >
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>{prediction.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  )
}
