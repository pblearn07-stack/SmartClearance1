"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  processingTimeData,
  statusDistribution,
  complianceTrend,
  pendingTrend,
  documentExpiryTrend,
  riskDistribution,
} from "@/lib/data"

const axisStyle = { fontSize: 12, fill: "var(--muted-foreground)" }
const gridStroke = "var(--border)"

function ChartTooltip({ active, payload, label, suffix }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-semibold text-foreground">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="inline-block size-2 rounded-full" style={{ background: p.color || p.payload?.color }} />
          <span className="font-medium text-foreground">
            {p.value}
            {suffix}
          </span>{" "}
          {p.name}
        </p>
      ))}
    </div>
  )
}

export function ComplianceTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={complianceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={axisStyle} tickLine={false} axisLine={{ stroke: gridStroke }} />
        <YAxis domain={[60, 100]} tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip suffix="%" />} />
        <Area
          type="monotone"
          dataKey="score"
          name="Compliance score"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#scoreFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function ProcessingTimeChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={processingTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 11 }} tickLine={false} axisLine={{ stroke: gridStroke }} interval={0} angle={-12} textAnchor="end" height={50} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip suffix=" days" />} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="days" name="Avg. days" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function StatusDonut() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip content={<ChartTooltip />} />
        <Pie data={statusDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={3} strokeWidth={0}>
          {statusDistribution.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export function PendingTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={pendingTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="month" tick={axisStyle} tickLine={false} axisLine={{ stroke: gridStroke }} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Line type="monotone" dataKey="pending" name="Pending items" stroke="var(--chart-3)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function DocumentExpiryChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={documentExpiryTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="month" tick={axisStyle} tickLine={false} axisLine={{ stroke: gridStroke }} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip suffix=" docs" />} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="expiring" name="Expiring" fill="var(--chart-3)" radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function RiskDonut() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Tooltip content={<ChartTooltip />} />
        <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3} strokeWidth={0}>
          {riskDistribution.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export function ChartLegend({ items }: { items: { name: string; color: string; value?: number | string }[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
      {items.map((i) => (
        <div key={i.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block size-2.5 rounded-full" style={{ background: i.color }} />
          {i.name}
          {i.value !== undefined && <span className="font-semibold text-foreground">({i.value})</span>}
        </div>
      ))}
    </div>
  )
}
