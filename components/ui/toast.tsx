"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastTone = "success" | "info" | "warning" | "error"
interface Toast {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

interface ToastContextValue {
  toast: (t: { title: string; description?: string; tone?: ToastTone }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

const config: Record<ToastTone, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: "text-success" },
  info: { icon: Info, className: "text-info" },
  warning: { icon: AlertTriangle, className: "text-warning-foreground" },
  error: { icon: XCircle, className: "text-destructive" },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback<ToastContextValue["toast"]>(
    ({ title, description, tone = "info" }) => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, title, description, tone }])
      setTimeout(() => remove(id), 4200)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = config[t.tone].icon
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg animate-in slide-in-from-bottom-2 fade-in"
            >
              <Icon className={cn("mt-0.5 size-5 shrink-0", config[t.tone].className)} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{t.title}</p>
                {t.description && <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
