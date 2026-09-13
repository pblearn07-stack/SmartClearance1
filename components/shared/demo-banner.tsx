import { Info } from "lucide-react"

export function DemoBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-info/20 bg-info-muted/50 px-4 py-3 text-sm text-info">
      <Info className="mt-0.5 size-4 shrink-0" />
      <p className="text-pretty">
        {children ?? (
          <>
            <span className="font-semibold">Prototype demo:</span> All data shown is illustrative and
            not connected to any live government system. Built for Smart India Hackathon 2026.
          </>
        )}
      </p>
    </div>
  )
}
