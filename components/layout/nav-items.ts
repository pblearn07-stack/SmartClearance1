import {
  LayoutDashboard,
  Building2,
  Compass,
  FileStack,
  FolderOpen,
  ShieldCheck,
  Sparkles,
  Landmark,
  BarChart3,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  group: "Overview" | "Approvals & Compliance" | "Intelligence" | "Account"
  badge?: { text: string; variant?: "default" | "danger" | "warning" | "info" | "neutral" }
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, group: "Overview" },
  { label: "Industry Profile", href: "/profile", icon: Building2, group: "Overview" },
  { label: "Discover Approvals", href: "/approvals", icon: Compass, group: "Approvals & Compliance" },
  {
    label: "My Applications",
    href: "/applications",
    icon: FileStack,
    group: "Approvals & Compliance",
    badge: { text: "5", variant: "info" },
  },
  { label: "Documents", href: "/documents", icon: FolderOpen, group: "Approvals & Compliance" },
  {
    label: "Compliance",
    href: "/compliance",
    icon: ShieldCheck,
    group: "Approvals & Compliance",
    badge: { text: "2 due", variant: "warning" },
  },
  {
    label: "AI Insights",
    href: "/insights",
    icon: Sparkles,
    group: "Intelligence",
    badge: { text: "AI", variant: "default" },
  },
  { label: "Government Schemes", href: "/schemes", icon: Landmark, group: "Intelligence" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, group: "Intelligence" },
  { label: "Notifications", href: "/notifications", icon: Bell, group: "Account" },
  { label: "Settings", href: "/settings", icon: Settings, group: "Account" },
]

export const navGroups: NavItem["group"][] = [
  "Overview",
  "Approvals & Compliance",
  "Intelligence",
  "Account",
]
