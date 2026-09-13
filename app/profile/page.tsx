"use client"

import { useState } from "react"
import {
  Building2,
  MapPin,
  Users,
  Factory,
  Pencil,
  Check,
  X,
  BadgeCheck,
  Landmark,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Label, Textarea } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { company } from "@/lib/data"

const industryTypes = ["Manufacturing", "Services", "Trading", "Agro-processing", "IT / Software", "Textiles"]
const sizes = ["Micro Enterprise", "Small Enterprise (MSME)", "Medium Enterprise (MSME)", "Large Enterprise"]

export default function ProfilePage() {
  const { toast } = useToast()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: company.name,
    industryType: company.industryType,
    businessCategory: company.businessCategory,
    companySize: company.companySize,
    registrationNumber: company.registrationNumber,
    gstin: company.gstin,
    investmentRange: company.investmentRange,
    employees: String(company.employees),
    location: company.location,
    state: company.state,
    district: company.district,
    landArea: company.landArea,
    productionCapacity: company.productionCapacity,
    contactPerson: company.contactPerson,
    contactEmail: company.contactEmail,
    contactPhone: company.contactPhone,
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = () => {
    setEditing(false)
    toast({ title: "Profile updated", description: "Your industry profile has been saved.", tone: "success" })
  }

  return (
    <div>
      <PageHeader
        title="Industry Profile"
        description="Your company classification drives automatic approval discovery and compliance mapping."
        actions={
          editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                <X className="size-4" />
                Cancel
              </Button>
              <Button onClick={save}>
                <Check className="size-4" />
                Save changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Pencil className="size-4" />
              Edit profile
            </Button>
          )
        }
      />

      <DemoBanner />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-4 text-primary" />
                Company details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Company name" editing={editing} value={form.name}>
                <Input value={form.name} onChange={set("name")} />
              </Field>
              <Field label="Registration number" editing={editing} value={form.registrationNumber}>
                <Input value={form.registrationNumber} onChange={set("registrationNumber")} />
              </Field>
              <Field label="Industry type" editing={editing} value={form.industryType}>
                <Select value={form.industryType} onChange={set("industryType")}>
                  {industryTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Business category" editing={editing} value={form.businessCategory}>
                <Input value={form.businessCategory} onChange={set("businessCategory")} />
              </Field>
              <Field label="Company size" editing={editing} value={form.companySize}>
                <Select value={form.companySize} onChange={set("companySize")}>
                  {sizes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label="GSTIN" editing={editing} value={form.gstin}>
                <Input value={form.gstin} onChange={set("gstin")} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="size-4 text-primary" />
                Operations & scale
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Investment range" editing={editing} value={form.investmentRange}>
                <Input value={form.investmentRange} onChange={set("investmentRange")} />
              </Field>
              <Field label="Employees" editing={editing} value={form.employees}>
                <Input value={form.employees} onChange={set("employees")} />
              </Field>
              <Field label="Land area" editing={editing} value={form.landArea}>
                <Input value={form.landArea} onChange={set("landArea")} />
              </Field>
              <Field label="Production capacity" editing={editing} value={form.productionCapacity}>
                <Input value={form.productionCapacity} onChange={set("productionCapacity")} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Address" editing={editing} value={form.location}>
                <Input value={form.location} onChange={set("location")} />
              </Field>
              <Field label="State" editing={editing} value={form.state}>
                <Input value={form.state} onChange={set("state")} />
              </Field>
              <Field label="District" editing={editing} value={form.district}>
                <Input value={form.district} onChange={set("district")} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                Compliance contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Contact person" editing={editing} value={form.contactPerson}>
                <Input value={form.contactPerson} onChange={set("contactPerson")} />
              </Field>
              <Field label="Email" editing={editing} value={form.contactEmail}>
                <Input value={form.contactEmail} onChange={set("contactEmail")} />
              </Field>
              <Field label="Phone" editing={editing} value={form.contactPhone}>
                <Input value={form.contactPhone} onChange={set("contactPhone")} />
              </Field>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                RI
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{form.name}</p>
                <p className="text-sm text-muted-foreground">{form.businessCategory}</p>
              </div>
              <Badge variant="success">
                <BadgeCheck className="size-3" />
                Verified MSME
              </Badge>
              <div className="mt-2 w-full border-t border-border pt-3 text-left">
                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Incorporated</dt>
                    <dd className="font-medium text-foreground">{company.incorporated}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Employees</dt>
                    <dd className="font-medium text-foreground">{form.employees}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">State</dt>
                    <dd className="font-medium text-foreground">{form.state}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Landmark className="size-4 text-primary" />
                Why this matters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-pretty">
                SmartClearance uses your profile — industry type, size, location, and scale — to
                automatically determine which approvals are mandatory, recommend relevant government
                schemes, and predict compliance risk. Keep it accurate for the best guidance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  editing,
  children,
}: {
  label: string
  value: string
  editing: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {editing ? (
        children
      ) : (
        <p className="text-sm font-medium text-foreground">{value}</p>
      )}
    </div>
  )
}
