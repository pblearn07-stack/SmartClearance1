"use client"

import { useMemo, useRef, useState } from "react"
import {
  Search,
  Upload,
  FileText,
  Download,
  Eye,
  Trash2,
  AlertTriangle,
  FolderOpen,
  CloudUpload,
  ShieldCheck,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Modal } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/components/ui/toast"
import { documents, documentCategories, type DocItem } from "@/lib/data"
import { verificationBadge } from "@/lib/status"
import { cn } from "@/lib/utils"

export default function DocumentsPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All categories")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(
    () =>
      documents.filter(
        (d) =>
          (category === "All categories" || d.category === category) &&
          (!query || d.name.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, category],
  )

  const verified = documents.filter((d) => d.verification === "Verified").length
  const expiring = documents.filter((d) => d.verification === "Expiring").length
  const pending = documents.filter((d) => d.verification === "Pending").length

  const doUpload = () => {
    setUploadOpen(false)
    toast({ title: "Document uploaded", description: "Your document was submitted for verification.", tone: "success" })
  }

  return (
    <div>
      <PageHeader
        title="Document Repository"
        description="One secure vault for all compliance documents — auto-linked to applications, with expiry tracking and verification status."
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="size-4" />
            Upload document
          </Button>
        }
      />

      <DemoBanner />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total documents" value={documents.length} icon={FolderOpen} tone="default" />
        <StatCard label="Verified" value={verified} icon={ShieldCheck} tone="success" />
        <StatCard label="Expiring soon" value={expiring} icon={AlertTriangle} tone="warning" />
        <StatCard label="Pending upload" value={pending} icon={CloudUpload} tone="danger" />
      </div>

      {expiring > 0 && (
        <Card className="mb-6 border-warning/30 bg-warning-muted/40">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning-foreground" />
            <div>
              <p className="text-sm font-semibold text-foreground">{expiring} documents expiring soon</p>
              <p className="text-sm text-muted-foreground">
                Renew Consent to Operate, Trade License, and ESI Registration to avoid compliance gaps.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 sm:w-72"
          />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
          <option>All categories</option>
          {documentCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No documents found" description="Try a different search or category." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d) => (
            <DocumentCard key={d.id} doc={d} />
          ))}
        </div>
      )}

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload document"
        description="Add a document to your compliance vault"
        footer={
          <>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={doUpload}>Upload</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Document name</Label>
            <Input placeholder="e.g. Air Quality Monitoring Report" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <Select defaultValue={documentCategories[0]}>
              {documentCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
            }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
              dragging ? "border-primary bg-accent/40" : "border-border hover:border-primary/40 hover:bg-muted/40",
            )}
          >
            <CloudUpload className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Click to browse or drag & drop</p>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG, DWG up to 10 MB</p>
            <input ref={fileRef} type="file" className="hidden" />
          </button>
        </div>
      </Modal>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  icon: typeof FolderOpen
  tone: "default" | "success" | "warning" | "danger"
}) {
  const toneClass = {
    default: "bg-primary/10 text-primary",
    success: "bg-success-muted text-success",
    warning: "bg-warning-muted text-warning-foreground",
    danger: "bg-destructive/10 text-destructive",
  }[tone]
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("flex size-10 items-center justify-center rounded-lg", toneClass)}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  )
}

function DocumentCard({ doc }: { doc: DocItem }) {
  const { toast } = useToast()
  const isPending = doc.verification === "Pending"
  return (
    <Card className={cn("flex flex-col", isPending && "border-dashed")}>
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FileText className="size-5" />
          </div>
          <Badge variant={verificationBadge(doc.verification)}>{doc.verification}</Badge>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground text-balance">{doc.name}</h3>
          <p className="text-xs text-muted-foreground">{doc.category}</p>
        </div>
        <dl className="flex flex-col gap-1 border-t border-border pt-3 text-xs">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Type / Size</dt>
            <dd className="font-medium text-foreground">
              {doc.type} · {doc.size}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Uploaded</dt>
            <dd className="font-medium text-foreground">{doc.uploaded}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Expiry</dt>
            <dd className={cn("font-medium", doc.verification === "Expiring" ? "text-warning-foreground" : "text-foreground")}>
              {doc.expiry}
            </dd>
          </div>
        </dl>
        <div className="mt-auto flex gap-2 pt-1">
          {isPending ? (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => toast({ title: "Upload", description: `Upload ${doc.name}`, tone: "info" })}
            >
              <Upload className="size-3.5" />
              Upload now
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => toast({ title: "Preview", description: doc.name, tone: "info" })}
              >
                <Eye className="size-3.5" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast({ title: "Download started", description: doc.name, tone: "success" })}
                aria-label="Download"
              >
                <Download className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toast({ title: "Remove", description: `${doc.name} (demo only)`, tone: "warning" })}
                aria-label="Delete"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
