import type { Status, RiskLevel } from "@/lib/data"

type BadgeVariant = "default" | "neutral" | "success" | "warning" | "danger" | "info" | "outline"
type Tone = "primary" | "success" | "warning" | "danger"

export function statusBadge(status: Status): BadgeVariant {
  switch (status) {
    case "Approved":
      return "success"
    case "Rejected":
      return "danger"
    case "Query Raised":
      return "warning"
    case "Under Review":
      return "info"
    case "Submitted":
      return "default"
    case "Draft":
    default:
      return "neutral"
  }
}

export function progressTone(status: Status): Tone {
  switch (status) {
    case "Approved":
      return "success"
    case "Rejected":
      return "danger"
    case "Query Raised":
      return "warning"
    default:
      return "primary"
  }
}

export function riskBadge(risk: RiskLevel): BadgeVariant {
  switch (risk) {
    case "High":
      return "danger"
    case "Medium":
      return "warning"
    case "Low":
    default:
      return "success"
  }
}

export function riskTone(risk: RiskLevel): Tone {
  switch (risk) {
    case "High":
      return "danger"
    case "Medium":
      return "warning"
    case "Low":
    default:
      return "success"
  }
}

export function complianceStatusBadge(
  status: "Completed" | "Due Soon" | "Pending" | "Overdue",
): BadgeVariant {
  switch (status) {
    case "Completed":
      return "success"
    case "Due Soon":
      return "warning"
    case "Overdue":
      return "danger"
    case "Pending":
    default:
      return "neutral"
  }
}

export function verificationBadge(v: "Verified" | "Pending" | "Expiring"): BadgeVariant {
  switch (v) {
    case "Verified":
      return "success"
    case "Expiring":
      return "warning"
    case "Pending":
    default:
      return "neutral"
  }
}
