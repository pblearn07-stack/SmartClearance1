"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { navItems, navGroups } from "@/components/layout/nav-items"
import { company } from "@/lib/data"

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <ShieldCheck className="size-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold tracking-tight text-foreground">SmartClearance</span>
          <span className="text-[11px] font-medium text-primary">SIH 2026 · PS 130</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group} className="mb-4">
            <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              {group}
            </p>
            <ul className="flex flex-col gap-0.5">
              {navItems
                .filter((n) => n.group === group)
                .map((item) => {
                  const active =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          "group relative flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn(
                              "size-4.5 shrink-0 transition-colors",
                              active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                            )}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <Badge
                            variant={item.badge.variant ?? "default"}
                            className="text-[10px] px-1.5 py-0 h-4 font-semibold"
                          >
                            {item.badge.text}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            RI
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-foreground">{company.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{company.businessCategory}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DesktopSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
      <div className="fixed inset-y-0 left-0 w-64">
        <SidebarContent />
      </div>
    </aside>
  )
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] animate-in fade-in" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border shadow-xl animate-in slide-in-from-left">
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  )
}
