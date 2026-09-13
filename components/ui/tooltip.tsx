"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function Tooltip({
  content,
  children,
  side = "top",
}: {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom"
}) {
  const [show, setShow] = useState(false)
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 z-50 w-max max-w-56 -translate-x-1/2 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md animate-in fade-in",
            side === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5",
          )}
        >
          {content}
        </span>
      )}
    </span>
  )
}
