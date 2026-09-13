"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import Link from "next/link"
import { Menu, Search, Bell, ChevronDown, LifeBuoy, X, Compass, FileText, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { notifications as allNotifications, company, discoverApprovals, documents, schemes } from "@/lib/data"

export function Header({ onMenu }: { onMenu: () => void }) {
  const unread = allNotifications.filter((n) => !n.read).length
  const [bellOpen, setBellOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const bellRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return { approvals: [], documents: [], schemes: [] }

    return {
      approvals: discoverApprovals
        .filter((a) => a.name.toLowerCase().includes(q) || a.department.toLowerCase().includes(q))
        .slice(0, 4),
      documents: documents
        .filter((d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
        .slice(0, 3),
      schemes: schemes
        .filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
        .slice(0, 3),
    }
  }, [searchQuery])

  const totalResults =
    searchResults.approvals.length + searchResults.documents.length + searchResults.schemes.length

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
        setSearchOpen(true)
      }
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu />
      </Button>

      <div className="relative hidden max-w-md flex-1 md:block" ref={searchRef}>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={searchInputRef}
          type="search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setSearchOpen(true)
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search approvals, documents, schemes... (Ctrl+K)"
          className="h-9 w-full rounded-lg border border-input bg-muted/40 pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground transition-all focus-visible:border-ring focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
        />
        {searchQuery ? (
          <button
            onClick={() => {
              setSearchQuery("")
              setSearchOpen(false)
            }}
            className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        )}

        {/* Live Search Results Dropdown */}
        {searchOpen && searchQuery.trim() && (
          <div className="absolute left-0 top-full mt-2 w-full min-w-[380px] overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-top-1 z-50">
            {totalResults === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No matching approvals, documents, or schemes found.
              </div>
            ) : (
              <div className="max-h-[380px] overflow-y-auto divide-y divide-border">
                {searchResults.approvals.length > 0 && (
                  <div className="p-2">
                    <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Compass className="size-3.5 text-primary" /> Approvals & Clearances
                    </p>
                    {searchResults.approvals.map((a) => (
                      <Link
                        key={a.id}
                        href="/approvals"
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-muted/70 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.department}</p>
                        </div>
                        <Badge variant={a.status === "Required" ? "danger" : "warning"} className="text-[10px]">
                          {a.status}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.documents.length > 0 && (
                  <div className="p-2">
                    <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <FileText className="size-3.5 text-info" /> Documents
                    </p>
                    {searchResults.documents.map((d) => (
                      <Link
                        key={d.id}
                        href="/documents"
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-muted/70 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.category} · {d.size}</p>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{d.validity}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.schemes.length > 0 && (
                  <div className="p-2">
                    <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Landmark className="size-3.5 text-success" /> Government Schemes
                    </p>
                    {searchResults.schemes.map((s) => (
                      <Link
                        key={s.id}
                        href="/schemes"
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-muted/70 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.benefit}</p>
                        </div>
                        <Badge variant="success" className="text-[10px]">
                          {s.level}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-1.5 md:flex-none">
        <a
          href="https://vercel.com/help"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
        >
          <LifeBuoy className="size-4" />
          Help
        </a>

        <div className="relative" ref={bellRef}>
          <Button variant="ghost" size="icon" onClick={() => setBellOpen((v) => !v)} aria-label="Notifications">
            <span className="relative">
              <Bell />
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </span>
          </Button>
          {bellOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-xl animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                <Badge variant="danger">{unread} new</Badge>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {allNotifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "flex flex-col gap-0.5 border-b border-border/60 px-4 py-3 last:border-0",
                      !n.read && "bg-info-muted/40",
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.detail}</p>
                    <p className="text-[11px] text-muted-foreground/70">{n.time}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/notifications"
                onClick={() => setBellOpen(false)}
                className="block border-t border-border px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-muted/50"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-muted"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              RI
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-xl animate-in fade-in slide-in-from-top-1">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">{company.contactPerson}</p>
                <p className="truncate text-xs text-muted-foreground">{company.contactEmail}</p>
              </div>
              <div className="flex flex-col p-1.5">
                <Link href="/profile" onClick={() => setProfileOpen(false)} className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted">
                  Industry Profile
                </Link>
                <Link href="/settings" onClick={() => setProfileOpen(false)} className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted">
                  Settings
                </Link>
                <Link href="/notifications" onClick={() => setProfileOpen(false)} className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted">
                  Notifications
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
