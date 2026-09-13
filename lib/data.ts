// SmartClearance — Illustrative Prototype Data
// NOTE: All figures below are demo/mock data for the SIH 2026 prototype.
// This is NOT connected to any real government database or API.

export type Status =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Query Raised"
  | "Approved"
  | "Rejected"

export type RiskLevel = "Low" | "Medium" | "High"

export const company = {
  name: "Raj Industries Pvt. Ltd.",
  industryType: "Manufacturing",
  businessCategory: "Automobile Components",
  registrationNumber: "U34100MP2019PTC048217",
  companySize: "Medium Enterprise (MSME)",
  location: "Pithampur Industrial Area, Indore",
  state: "Madhya Pradesh",
  district: "Dhar",
  investmentRange: "₹5 Cr – ₹10 Cr",
  employees: 148,
  landArea: "2.4 hectares",
  productionCapacity: "12,000 units / month",
  contactEmail: "compliance@rajindustries.in",
  contactPhone: "+91 731 4005 220",
  contactPerson: "Raj Malhotra, Compliance Head",
  gstin: "23AABCR1234F1Z5",
  incorporated: "2019",
}

export const kpis = [
  { key: "active", label: "Active Approvals", value: 5, delta: "+2 this quarter", tone: "info" as const },
  { key: "completed", label: "Completed Approvals", value: 12, delta: "+3 this year", tone: "success" as const },
  { key: "pending", label: "Pending Actions", value: 4, delta: "2 need attention", tone: "warning" as const },
  { key: "score", label: "Compliance Score", value: "87%", delta: "+4% vs last month", tone: "success" as const },
]

export interface ApprovalProgress {
  id: string
  name: string
  status: Status
  progress: number
  submitted: string
  expected: string
  department: string
}

export const approvalProgress: ApprovalProgress[] = [
  { id: "APP-2041", name: "Factory License", status: "Under Review", progress: 65, submitted: "12 Aug 2026", expected: "18 Oct 2026", department: "Labour Department" },
  { id: "APP-2042", name: "Pollution Control Consent", status: "Query Raised", progress: 45, submitted: "05 Aug 2026", expected: "25 Oct 2026", department: "Pollution Control Board" },
  { id: "APP-2043", name: "Fire Safety Certificate", status: "Approved", progress: 100, submitted: "20 Jul 2026", expected: "Completed", department: "Fire & Emergency Services" },
  { id: "APP-2044", name: "Environmental Clearance", status: "Submitted", progress: 25, submitted: "01 Sep 2026", expected: "15 Dec 2026", department: "SEIAA / MoEFCC" },
  { id: "APP-2045", name: "Labour Registration", status: "Under Review", progress: 70, submitted: "10 Aug 2026", expected: "05 Nov 2026", department: "Labour Department" },
]

export interface UpcomingAction {
  id: string
  title: string
  due: string
  type: "document" | "query" | "inspection" | "renewal"
  priority: "high" | "medium" | "low"
}

export const upcomingActions: UpcomingAction[] = [
  { id: "UA-1", title: "Respond to Pollution Board query", due: "16 Oct 2026", type: "query", priority: "high" },
  { id: "UA-2", title: "Upload air quality monitoring report", due: "18 Oct 2026", type: "document", priority: "high" },
  { id: "UA-3", title: "Annual fire safety inspection", due: "18 Oct 2026", type: "inspection", priority: "medium" },
  { id: "UA-4", title: "Renew Trade License", due: "30 Oct 2026", type: "renewal", priority: "medium" },
  { id: "UA-5", title: "Submit labour welfare quarterly return", due: "05 Nov 2026", type: "document", priority: "low" },
]

export interface Approval {
  id: string
  name: string
  department: string
  category: "Mandatory" | "Conditional" | "Optional"
  processing: string
  status: "Required" | "Recommended" | "Not Applicable"
  purpose: string
  authority: string
  eligibility: string[]
  documents: string[]
  steps: string[]
  fees: string
  renewal: string
  whyRequired: string
}

export const discoverApprovals: Approval[] = [
  {
    id: "factory-license",
    name: "Factory License",
    department: "Labour Department",
    category: "Mandatory",
    processing: "15–30 days",
    status: "Required",
    authority: "Directorate of Industrial Health & Safety, Govt. of Madhya Pradesh",
    purpose: "Legal permission to operate a factory employing workers under the Factories Act, 1948.",
    eligibility: ["Registered manufacturing unit", "Employs 10+ workers with power / 20+ without power", "Approved factory building plan"],
    documents: ["Building plan approval", "Land ownership / lease deed", "List of machinery", "Worker headcount declaration", "Company registration certificate"],
    steps: ["Documents Required", "Application Prepared", "Submitted", "Under Review", "Approval / Query", "Completed"],
    fees: "₹12,500 (based on worker count & HP)",
    renewal: "Annual",
    whyRequired: "Your unit is an automobile-components manufacturer with 148 employees using power-driven machinery, which mandates a Factory License under the Factories Act, 1948.",
  },
  {
    id: "pollution-consent",
    name: "Pollution Control Consent (CTE/CTO)",
    department: "Pollution Control Board",
    category: "Mandatory",
    processing: "20–45 days",
    status: "Required",
    authority: "Madhya Pradesh Pollution Control Board (MPPCB)",
    purpose: "Consent to Establish (CTE) and Consent to Operate (CTO) under the Water & Air Acts.",
    eligibility: ["Industry in Red/Orange/Green category", "Effluent & emission treatment plan", "Environmental management setup"],
    documents: ["Site plan", "Effluent treatment details", "Air emission details", "Hazardous waste authorization", "Water consumption estimate"],
    steps: ["Documents Required", "Application Prepared", "Submitted", "Under Review", "Approval / Query", "Completed"],
    fees: "₹35,000 (category-based)",
    renewal: "5 years (CTO)",
    whyRequired: "Automobile-components manufacturing typically falls in the Orange category, requiring consent to manage air emissions, effluent and hazardous waste.",
  },
  {
    id: "fire-safety",
    name: "Fire Safety Certificate",
    department: "Fire & Emergency Services",
    category: "Mandatory",
    processing: "7–15 days",
    status: "Required",
    authority: "MP Fire & Emergency Services Department",
    purpose: "Certifies that the premises meet fire prevention and life-safety norms.",
    eligibility: ["Fire-fighting equipment installed", "Emergency exits & signage", "Fire NOC from local authority"],
    documents: ["Building layout", "Fire equipment list", "Electrical safety certificate", "Occupancy certificate"],
    steps: ["Documents Required", "Application Prepared", "Submitted", "Under Review", "Approval / Query", "Completed"],
    fees: "₹8,000",
    renewal: "3 years",
    whyRequired: "Industrial premises with machinery and stored materials require a fire safety certificate to protect workers and assets.",
  },
  {
    id: "environmental-clearance",
    name: "Environmental Clearance (EC)",
    department: "SEIAA / MoEFCC",
    category: "Conditional",
    processing: "60–120 days",
    status: "Recommended",
    authority: "State Environment Impact Assessment Authority",
    purpose: "Prior environmental clearance for projects above notified thresholds.",
    eligibility: ["Project above EIA notification threshold", "Environmental Impact Assessment report", "Public consultation (if applicable)"],
    documents: ["EIA/EMP report", "Land use certificate", "Water & power sanction", "Project feasibility report"],
    steps: ["Documents Required", "Application Prepared", "Submitted", "Under Review", "Approval / Query", "Completed"],
    fees: "As per project scale",
    renewal: "Project-specific validity",
    whyRequired: "Recommended if planned expansion crosses EIA thresholds; currently applicable for your proposed capacity increase.",
  },
  {
    id: "labour-registration",
    name: "Labour Registration (Shops & Establishments)",
    department: "Labour Department",
    category: "Mandatory",
    processing: "10–20 days",
    status: "Required",
    authority: "Labour Commissioner, Govt. of Madhya Pradesh",
    purpose: "Registration of establishment and workforce under labour welfare laws.",
    eligibility: ["Operating establishment with employees", "Wage & attendance records", "Welfare facilities compliance"],
    documents: ["Employee register", "Wage register", "PF/ESI registration", "Company PAN"],
    steps: ["Documents Required", "Application Prepared", "Submitted", "Under Review", "Approval / Query", "Completed"],
    fees: "₹4,500",
    renewal: "Annual",
    whyRequired: "Establishments employing workers must register to comply with labour welfare and wage regulations.",
  },
  {
    id: "gst-registration",
    name: "GST Registration",
    department: "Commercial Tax / GSTN",
    category: "Mandatory",
    processing: "3–7 days",
    status: "Not Applicable",
    authority: "Goods & Services Tax Network",
    purpose: "Tax registration for supply of goods and services.",
    eligibility: ["Turnover above threshold", "Valid PAN", "Business proof"],
    documents: ["PAN", "Business address proof", "Bank details", "Authorized signatory proof"],
    steps: ["Documents Required", "Application Prepared", "Submitted", "Under Review", "Approval / Query", "Completed"],
    fees: "No fee",
    renewal: "Not required",
    whyRequired: "Already registered (GSTIN active). Shown here for completeness of the compliance map.",
  },
]

export interface Application {
  id: string
  approval: string
  department: string
  submitted: string
  status: Status
  progress: number
  expected: string
  timeline: { label: string; date: string; done: boolean; note?: string }[]
}

export const applications: Application[] = [
  {
    id: "APP-2041",
    approval: "Factory License",
    department: "Labour Department",
    submitted: "12 Aug 2026",
    status: "Under Review",
    progress: 65,
    expected: "18 Oct 2026",
    timeline: [
      { label: "Application submitted", date: "12 Aug 2026", done: true },
      { label: "Document verification", date: "20 Aug 2026", done: true },
      { label: "Site inspection scheduled", date: "28 Sep 2026", done: true, note: "Inspector assigned: DIHS Indore" },
      { label: "Under departmental review", date: "02 Oct 2026", done: false, note: "Awaiting inspection report" },
      { label: "Decision", date: "18 Oct 2026 (expected)", done: false },
    ],
  },
  {
    id: "APP-2042",
    approval: "Pollution Control Consent",
    department: "Pollution Control Board",
    submitted: "05 Aug 2026",
    status: "Query Raised",
    progress: 45,
    expected: "25 Oct 2026",
    timeline: [
      { label: "Application submitted", date: "05 Aug 2026", done: true },
      { label: "Scrutiny completed", date: "18 Aug 2026", done: true },
      { label: "Query raised by board", date: "22 Sep 2026", done: true, note: "Air quality monitoring report missing" },
      { label: "Awaiting applicant response", date: "Pending", done: false, note: "Action required from you" },
      { label: "Decision", date: "25 Oct 2026 (expected)", done: false },
    ],
  },
  {
    id: "APP-2043",
    approval: "Fire Safety Certificate",
    department: "Fire & Emergency Services",
    submitted: "20 Jul 2026",
    status: "Approved",
    progress: 100,
    expected: "Completed",
    timeline: [
      { label: "Application submitted", date: "20 Jul 2026", done: true },
      { label: "Premises inspection", date: "02 Aug 2026", done: true },
      { label: "Compliance verified", date: "09 Aug 2026", done: true },
      { label: "Certificate issued", date: "14 Aug 2026", done: true, note: "Valid till 14 Aug 2029" },
    ],
  },
  {
    id: "APP-2044",
    approval: "Environmental Clearance",
    department: "SEIAA / MoEFCC",
    submitted: "01 Sep 2026",
    status: "Submitted",
    progress: 25,
    expected: "15 Dec 2026",
    timeline: [
      { label: "Application submitted", date: "01 Sep 2026", done: true },
      { label: "Screening", date: "In progress", done: false },
      { label: "Scoping / EIA review", date: "Pending", done: false },
      { label: "Appraisal", date: "Pending", done: false },
      { label: "Decision", date: "15 Dec 2026 (expected)", done: false },
    ],
  },
  {
    id: "APP-2045",
    approval: "Labour Registration",
    department: "Labour Department",
    submitted: "10 Aug 2026",
    status: "Under Review",
    progress: 70,
    expected: "05 Nov 2026",
    timeline: [
      { label: "Application submitted", date: "10 Aug 2026", done: true },
      { label: "Record verification", date: "24 Aug 2026", done: true },
      { label: "Under review", date: "30 Sep 2026", done: false },
      { label: "Decision", date: "05 Nov 2026 (expected)", done: false },
    ],
  },
  {
    id: "APP-2039",
    approval: "Trade License (Renewal)",
    department: "Municipal Corporation",
    submitted: "28 Jun 2026",
    status: "Draft",
    progress: 10,
    expected: "Not submitted",
    timeline: [
      { label: "Draft created", date: "28 Jun 2026", done: true },
      { label: "Awaiting document upload", date: "Pending", done: false },
    ],
  },
]

export interface DocItem {
  id: string
  name: string
  type: string
  category: string
  uploaded: string
  expiry: string
  verification: "Verified" | "Pending" | "Expiring"
  size: string
}

export const documentCategories = [
  "Identity Documents",
  "Company Registration",
  "Land Documents",
  "Environmental Documents",
  "Financial Documents",
  "Licenses",
  "Certificates",
]

export const documents: DocItem[] = [
  { id: "D-01", name: "Certificate of Incorporation", type: "PDF", category: "Company Registration", uploaded: "10 Jan 2024", expiry: "No expiry", verification: "Verified", size: "1.2 MB" },
  { id: "D-02", name: "PAN Card", type: "PDF", category: "Identity Documents", uploaded: "10 Jan 2024", expiry: "No expiry", verification: "Verified", size: "0.4 MB" },
  { id: "D-03", name: "GST Registration Certificate", type: "PDF", category: "Company Registration", uploaded: "12 Jan 2024", expiry: "No expiry", verification: "Verified", size: "0.8 MB" },
  { id: "D-04", name: "Land Lease Deed", type: "PDF", category: "Land Documents", uploaded: "15 Feb 2024", expiry: "31 Mar 2034", verification: "Verified", size: "3.1 MB" },
  { id: "D-05", name: "Fire Safety Certificate", type: "PDF", category: "Certificates", uploaded: "14 Aug 2026", expiry: "14 Aug 2029", verification: "Verified", size: "0.9 MB" },
  { id: "D-06", name: "Consent to Operate (Prev.)", type: "PDF", category: "Environmental Documents", uploaded: "20 Sep 2023", expiry: "19 Oct 2026", verification: "Expiring", size: "1.5 MB" },
  { id: "D-07", name: "Trade License", type: "PDF", category: "Licenses", uploaded: "01 Nov 2023", expiry: "31 Oct 2026", verification: "Expiring", size: "0.6 MB" },
  { id: "D-08", name: "Factory Building Plan", type: "DWG", category: "Land Documents", uploaded: "05 Mar 2024", expiry: "No expiry", verification: "Verified", size: "5.4 MB" },
  { id: "D-09", name: "Air Quality Monitoring Report", type: "PDF", category: "Environmental Documents", uploaded: "—", expiry: "Required", verification: "Pending", size: "—" },
  { id: "D-10", name: "Audited Financial Statement FY24", type: "PDF", category: "Financial Documents", uploaded: "30 Jun 2024", expiry: "No expiry", verification: "Verified", size: "2.2 MB" },
  { id: "D-11", name: "ESI Registration", type: "PDF", category: "Licenses", uploaded: "18 Jan 2024", expiry: "05 Nov 2026", verification: "Expiring", size: "0.5 MB" },
  { id: "D-12", name: "Authorized Signatory ID", type: "PDF", category: "Identity Documents", uploaded: "10 Jan 2024", expiry: "22 Aug 2031", verification: "Verified", size: "0.3 MB" },
]

export interface ComplianceCategory {
  name: string
  score: number
  completed: number
  dueSoon: number
  overdue: number
}

export const complianceScore = 87

export const complianceCategories: ComplianceCategory[] = [
  { name: "Environmental", score: 78, completed: 6, dueSoon: 2, overdue: 0 },
  { name: "Labour", score: 92, completed: 9, dueSoon: 1, overdue: 0 },
  { name: "Fire Safety", score: 100, completed: 4, dueSoon: 0, overdue: 0 },
  { name: "Factory Safety", score: 85, completed: 7, dueSoon: 1, overdue: 0 },
  { name: "Legal", score: 88, completed: 5, dueSoon: 1, overdue: 0 },
  { name: "Financial", score: 80, completed: 4, dueSoon: 0, overdue: 1 },
]

export interface ComplianceTask {
  id: string
  title: string
  category: string
  due: string
  status: "Completed" | "Due Soon" | "Pending" | "Overdue"
}

export const complianceTasks: ComplianceTask[] = [
  { id: "C-1", title: "Annual Fire Safety Inspection", category: "Fire Safety", due: "18 Oct 2026", status: "Due Soon" },
  { id: "C-2", title: "Pollution Monitoring Report", category: "Environmental", due: "25 Oct 2026", status: "Pending" },
  { id: "C-3", title: "Consent to Operate Renewal", category: "Environmental", due: "19 Oct 2026", status: "Due Soon" },
  { id: "C-4", title: "Quarterly Labour Welfare Return", category: "Labour", due: "05 Nov 2026", status: "Pending" },
  { id: "C-5", title: "Annual Financial Audit Filing", category: "Financial", due: "30 Sep 2026", status: "Overdue" },
  { id: "C-6", title: "Factory Machinery Safety Audit", category: "Factory Safety", due: "12 Nov 2026", status: "Pending" },
  { id: "C-7", title: "GST Annual Return", category: "Legal", due: "31 Dec 2026", status: "Pending" },
  { id: "C-8", title: "Hazardous Waste Manifest", category: "Environmental", due: "15 Sep 2026", status: "Completed" },
]

export interface DelayPrediction {
  id: string
  approval: string
  risk: RiskLevel
  probability: number
  factors: string[]
  recommendation: string
}

export const delayPredictions: DelayPrediction[] = [
  {
    id: "DP-1",
    approval: "Pollution Control Consent",
    risk: "High",
    probability: 72,
    factors: ["Missing supporting document", "Extended review-stage duration", "Previous query raised", "Application complexity"],
    recommendation: "Upload the missing air quality monitoring report and respond to the department query to reduce potential delay.",
  },
  {
    id: "DP-2",
    approval: "Environmental Clearance",
    risk: "Medium",
    probability: 48,
    factors: ["Multi-stage appraisal process", "Seasonal application backlog"],
    recommendation: "Pre-submit the EIA supporting annexures early to keep the appraisal timeline on track.",
  },
  {
    id: "DP-3",
    approval: "Factory License",
    risk: "Low",
    probability: 18,
    factors: ["Inspection completed", "Documents verified"],
    recommendation: "No action required. Continue monitoring for the final decision.",
  },
]

export const complianceRisk = {
  level: "Medium" as RiskLevel,
  score: 34,
  factors: [
    { label: "Overdue financial audit filing", impact: "High" },
    { label: "2 environmental tasks due soon", impact: "Medium" },
    { label: "Expiring Consent to Operate", impact: "Medium" },
  ],
  recommendations: [
    "Prioritise the overdue annual financial audit filing.",
    "Schedule the pollution monitoring report submission this week.",
    "Initiate Consent to Operate renewal before 19 Oct 2026.",
  ],
}

export const smartRecommendations = [
  { id: "R-1", title: "Upload expiring certificate", detail: "Consent to Operate expires 19 Oct 2026.", type: "document" },
  { id: "R-2", title: "Respond to approval query", detail: "Pollution Board query awaiting your reply.", type: "query" },
  { id: "R-3", title: "Schedule compliance inspection", detail: "Fire safety inspection due 18 Oct 2026.", type: "inspection" },
  { id: "R-4", title: "Review environmental documentation", detail: "EIA annexures recommended before appraisal.", type: "review" },
]

export interface Scheme {
  id: string
  name: string
  department: string
  match: number
  benefitType: string
  estBenefit: string
  deadline: string
  eligibility: string[]
  description: string
}

export const schemes: Scheme[] = [
  {
    id: "S-1",
    name: "Manufacturing Growth Support Program",
    department: "Ministry of MSME",
    match: 92,
    benefitType: "Capital investment support",
    estBenefit: "Up to 25% capital subsidy",
    deadline: "31 Mar 2027",
    eligibility: ["Registered MSME", "Manufacturing sector", "Investment in plant & machinery"],
    description: "Support program encouraging capacity expansion and modernization for manufacturing MSMEs.",
  },
  {
    id: "S-2",
    name: "Industrial Cluster Development Scheme",
    department: "Dept. of Industries, MP",
    match: 84,
    benefitType: "Infrastructure support",
    estBenefit: "Shared infrastructure & incentives",
    deadline: "30 Nov 2026",
    eligibility: ["Unit within notified industrial area", "Cluster participation"],
    description: "Develops common infrastructure and shared facilities for units in notified industrial clusters.",
  },
  {
    id: "S-3",
    name: "Green Technology Adoption Incentive",
    department: "Ministry of Environment",
    match: 76,
    benefitType: "Sustainability grant",
    estBenefit: "Grant for pollution-control upgrades",
    deadline: "28 Feb 2027",
    eligibility: ["Adoption of cleaner technology", "Verified emission reduction"],
    description: "Encourages adoption of cleaner production and pollution-control technologies.",
  },
  {
    id: "S-4",
    name: "Skill Development & Employment Support",
    department: "Ministry of Skill Development",
    match: 71,
    benefitType: "Training reimbursement",
    estBenefit: "Per-trainee reimbursement",
    deadline: "15 Jan 2027",
    eligibility: ["Employer-led training programs", "Placement commitment"],
    description: "Reimburses training costs for upskilling the industrial workforce.",
  },
  {
    id: "S-5",
    name: "Export Promotion Capital Support",
    department: "DGFT",
    match: 63,
    benefitType: "Duty concession",
    estBenefit: "Capital goods duty relief",
    deadline: "31 Mar 2027",
    eligibility: ["Export obligation commitment", "Import of capital goods"],
    description: "Allows import of capital goods at concessional duty against export obligations.",
  },
  {
    id: "S-6",
    name: "Credit Guarantee for MSMEs",
    department: "CGTMSE / SIDBI",
    match: 58,
    benefitType: "Collateral-free credit",
    estBenefit: "Guaranteed working-capital cover",
    deadline: "Ongoing",
    eligibility: ["MSME registered", "Working capital / term loan need"],
    description: "Provides collateral-free credit guarantee cover for eligible MSME loans.",
  },
]

// ---- Analytics chart data ----

export const processingTimeData = [
  { name: "Factory License", days: 45 },
  { name: "Pollution Consent", days: 68 },
  { name: "Fire Safety", days: 22 },
  { name: "Labour Reg.", days: 34 },
  { name: "Env. Clearance", days: 92 },
]

export const statusDistribution = [
  { name: "Approved", value: 12, color: "var(--color-chart-2)" },
  { name: "Under Review", value: 5, color: "var(--color-chart-1)" },
  { name: "Query Raised", value: 2, color: "var(--color-chart-3)" },
  { name: "Draft", value: 3, color: "var(--color-chart-4)" },
]

export const complianceTrend = [
  { month: "Apr", score: 74 },
  { month: "May", score: 76 },
  { month: "Jun", score: 79 },
  { month: "Jul", score: 81 },
  { month: "Aug", score: 84 },
  { month: "Sep", score: 87 },
]

export const pendingTrend = [
  { month: "Apr", pending: 8 },
  { month: "May", pending: 7 },
  { month: "Jun", pending: 6 },
  { month: "Jul", pending: 5 },
  { month: "Aug", pending: 5 },
  { month: "Sep", pending: 4 },
]

export const documentExpiryTrend = [
  { month: "Oct", expiring: 3 },
  { month: "Nov", expiring: 2 },
  { month: "Dec", expiring: 1 },
  { month: "Jan", expiring: 2 },
  { month: "Feb", expiring: 0 },
  { month: "Mar", expiring: 1 },
]

export const riskDistribution = [
  { name: "Low", value: 6, color: "var(--color-chart-2)" },
  { name: "Medium", value: 3, color: "var(--color-chart-3)" },
  { name: "High", value: 1, color: "var(--color-chart-5)" },
]

export type NotificationType = "status" | "document" | "compliance" | "approval" | "scheme"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  detail: string
  time: string
  read: boolean
}

export const notifications: Notification[] = [
  { id: "N-1", type: "status", title: "Application status updated", detail: "Factory License moved to Under Review.", time: "2 hours ago", read: false },
  { id: "N-2", type: "document", title: "Document expiring soon", detail: "Consent to Operate expires on 19 Oct 2026.", time: "5 hours ago", read: false },
  { id: "N-3", type: "compliance", title: "Compliance action overdue", detail: "Annual financial audit filing is overdue.", time: "1 day ago", read: false },
  { id: "N-4", type: "approval", title: "Approval completed", detail: "Fire Safety Certificate has been issued.", time: "2 days ago", read: true },
  { id: "N-5", type: "scheme", title: "New scheme recommendation", detail: "Manufacturing Growth Support Program — 92% match.", time: "3 days ago", read: true },
  { id: "N-6", type: "status", title: "Query raised", detail: "Pollution Board requested air quality monitoring report.", time: "4 days ago", read: true },
  { id: "N-7", type: "document", title: "Document verified", detail: "Audited Financial Statement FY24 verified.", time: "5 days ago", read: true },
]

export const workflowSteps = [
  { key: "profile", label: "Industry Profile", href: "/profile", desc: "Define your company & classification" },
  { key: "discover", label: "Approval Discovery", href: "/approvals", desc: "Find required approvals smartly" },
  { key: "apply", label: "Apply & Track", href: "/applications", desc: "Digital application & tracking" },
  { key: "documents", label: "Documents", href: "/documents", desc: "Manage & verify documents" },
  { key: "compliance", label: "Compliance", href: "/compliance", desc: "Monitor obligations" },
  { key: "insights", label: "AI Prediction", href: "/insights", desc: "Risk & delay intelligence" },
  { key: "schemes", label: "Schemes", href: "/schemes", desc: "Personalized govt. support" },
  { key: "analytics", label: "Analytics", href: "/analytics", desc: "Alerts & insights" },
]
