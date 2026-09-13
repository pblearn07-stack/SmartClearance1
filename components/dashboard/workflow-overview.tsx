import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { workflowSteps } from "@/lib/data"

export function WorkflowOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How SmartClearance works</CardTitle>
        <p className="text-sm text-muted-foreground">
          A unified, end-to-end journey from discovery to compliance — replacing fragmented,
          department-by-department paperwork.
        </p>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, i) => (
            <li key={step.key}>
              <Link
                href={step.href}
                className="group flex h-full flex-col justify-between gap-3 rounded-xl border border-border/80 bg-background/60 p-4 transition-all card-hover hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary shadow-xs">
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Open</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {step.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
