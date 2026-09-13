"use client"

import { useState } from "react"
import {
  Bell,
  Mail,
  MessageSquare,
  Globe,
  ShieldCheck,
  User,
  Save,
  Trash2,
  Database,
  Key,
  RefreshCw,
  CheckCircle2,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import { company } from "@/lib/data"
import { buildApiUrl } from "@/lib/api"
import { cn } from "@/lib/utils"

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "inline-block size-4.5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5.5" : "translate-x-0.5",
        )}
      />
    </button>
  )
}

function PrefRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: typeof Bell
  title: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4.5" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  )
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [ogdUrl, setOgdUrl] = useState("https://api.data.gov.in")
  const [ogdKey, setOgdKey] = useState("579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b")
  const [dailySync, setDailySync] = useState(true)
  const [testingConnection, setTestingConnection] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null)

  const handleTestConnection = async () => {
    setTestingConnection(true)
    try {
      const res = await fetch(buildApiUrl("/api/government-data/sync"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: ogdKey, baseUrl: ogdUrl }),
      })
      const data = await res.json()
      setLastSyncResult(data.message || "Connected successfully")
      toast({
        title: "Connection Successful",
        description: data.message || "Connected to data.gov.in. Preprocessing pipeline verified.",
        tone: "success",
      })
    } catch {
      toast({
        title: "Connection Failed",
        description: "Could not reach government open data endpoint.",
        tone: "danger",
      })
    } finally {
      setTestingConnection(false)
    }
  }

  const [prefs, setPrefs] = useState({
    email: true,
    sms: false,
    push: true,
    statusAlerts: true,
    expiryAlerts: true,
    complianceAlerts: true,
    schemeAlerts: false,
  })
  const setPref = (k: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [k]: v }))

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account, notification channels, and platform preferences."
        actions={
          <Button onClick={() => toast({ title: "Settings saved", description: "Your preferences have been updated.", tone: "success" })}>
            <Save className="size-4" />
            Save changes
          </Button>
        }
      />

      <DemoBanner />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-4 text-primary" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Contact person</Label>
              <Input defaultValue={company.contactPerson} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Email</Label>
              <Input defaultValue={company.contactEmail} type="email" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Phone</Label>
              <Input defaultValue={company.contactPhone} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-4 text-primary" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Language</Label>
              <Select defaultValue="English">
                <option>English</option>
                <option>हिन्दी (Hindi)</option>
                <option>मराठी (Marathi)</option>
                <option>தமிழ் (Tamil)</option>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Time zone</Label>
              <Select defaultValue="IST (UTC+5:30)">
                <option>IST (UTC+5:30)</option>
                <option>UTC</option>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Default state jurisdiction</Label>
              <Select defaultValue={company.state}>
                <option>Madhya Pradesh</option>
                <option>Maharashtra</option>
                <option>Gujarat</option>
                <option>Karnataka</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-4 text-primary" />
              Notification channels
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <PrefRow icon={Mail} title="Email notifications" description="Receive updates via email" checked={prefs.email} onChange={setPref("email")} />
            <PrefRow icon={MessageSquare} title="SMS alerts" description="Critical alerts via text message" checked={prefs.sms} onChange={setPref("sms")} />
            <PrefRow icon={Bell} title="In-app push" description="Real-time notifications in the platform" checked={prefs.push} onChange={setPref("push")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Alert types
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <PrefRow icon={ShieldCheck} title="Status changes" description="When an application status updates" checked={prefs.statusAlerts} onChange={setPref("statusAlerts")} />
            <PrefRow icon={ShieldCheck} title="Document expiry" description="Before documents expire" checked={prefs.expiryAlerts} onChange={setPref("expiryAlerts")} />
            <PrefRow icon={ShieldCheck} title="Compliance deadlines" description="Upcoming obligations and filings" checked={prefs.complianceAlerts} onChange={setPref("complianceAlerts")} />
            <PrefRow icon={ShieldCheck} title="New scheme matches" description="When new schemes match your profile" checked={prefs.schemeAlerts} onChange={setPref("schemeAlerts")} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <p className="text-sm text-muted-foreground">Irreversible actions. Demo only — nothing is deleted.</p>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={() => toast({ title: "Demo action", description: "Account deletion is disabled in this prototype.", tone: "warning" })}
          >
            <Trash2 className="size-4" />
            Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
