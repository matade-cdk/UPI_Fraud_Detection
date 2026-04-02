export const heroTypedStrings = [
  "UPI Transactions",
  "Payment Patterns",
  "Suspicious Activity",
  "Financial Threats",
];

export const trustItems = [
  "NPCI",
  "RBI Compliant",
  "ISO 27001",
  "PCI-DSS",
  "CERT-In",
  "GDPR Ready",
];

export const featureCards = [
  {
    title: "Real-Time Detection",
    desc: "Flags fraudulent transactions in under 200ms before money leaves your account.",
    tag: "< 200ms",
  },
  {
    title: "Behavioural AI Engine",
    desc: "Analyzes 47+ signals across device, geo, frequency and merchant behavior.",
    tag: "47 signals",
  },
  {
    title: "99.3% Accuracy",
    desc: "Production model performance with very low false positives.",
    tag: "99.3% acc",
  },
  {
    title: "Multi-Account Shield",
    desc: "Monitors multiple UPI IDs and catches coordinated attack patterns.",
    tag: "Multi-UPI",
  },
  {
    title: "Explainable Reports",
    desc: "Every decision includes clear reasons and weighted risk factors.",
    tag: "XAI Ready",
  },
  {
    title: "Bank-Grade Security",
    desc: "Built for RBI and PCI-aligned workflows with encrypted data paths.",
    tag: "ISO 27001",
  },
];

export const testimonials = [
  {
    name: "Priya Sharma",
    role: "CFO, TechPay Solutions",
    quote:
      "UPIGuard caught a 2.4L fraudulent transfer that bypassed our bank filters.",
  },
  {
    name: "Rahul Mehra",
    role: "Security Lead, FinoBank",
    quote:
      "False positive rate is genuinely impressive and operations workload dropped.",
  },
  {
    name: "Ananya Iyer",
    role: "Product Manager, QuickPe",
    quote:
      "Real-time alerts and audit trail made compliance and response much easier.",
  },
];

export const overviewCards = [
  { label: "Total Transactions", value: "12,847", trend: "+4.2% today", color: "normal" },
  { label: "Fraud Detected", value: "38", trend: "+2 in last hour", color: "danger" },
  { label: "Flagged / Review", value: "112", trend: "-8% vs yesterday", color: "warning" },
  { label: "Model Accuracy", value: "99.3%", trend: "Live production", color: "normal" },
];

export const transactions = [
  { id: "TXN-9182", upi: "raj@okhdfc", amount: "Rs 82,000", time: "03:14", risk: "HIGH", score: 91 },
  { id: "TXN-9181", upi: "priya@ybl", amount: "Rs 1,200", time: "02:58", risk: "LOW", score: 4 },
  { id: "TXN-9180", upi: "unknown@paytm", amount: "Rs 34,500", time: "02:41", risk: "MEDIUM", score: 58 },
  { id: "TXN-9178", upi: "abc@okaxis", amount: "Rs 61,000", time: "01:55", risk: "HIGH", score: 88 },
  { id: "TXN-9177", upi: "maya@icici", amount: "Rs 8,400", time: "01:33", risk: "MEDIUM", score: 47 },
];

export const alerts = [
  {
    tier: "HIGH",
    text: "High-value transfer Rs 82,000 to new UPI at 3AM flagged by velocity anomaly.",
    time: "2m ago",
  },
  {
    tier: "HIGH",
    text: "Rs 61,000 transfer to unknown recipient with device mismatch.",
    time: "8m ago",
  },
  {
    tier: "MEDIUM",
    text: "Rs 34,500 to unverified merchant with score 58/100.",
    time: "22m ago",
  },
  {
    tier: "LOW",
    text: "Routine flag cleared for TXN-9174 after analyst review.",
    time: "2h ago",
  },
];

export const fraudTrend = [12, 18, 8, 31, 27, 6, 4, 22, 15, 38, 11, 9, 44, 30];

export const weeklyBars = [
  { day: "Mon", total: 1840, fraud: 12 },
  { day: "Tue", total: 2100, fraud: 18 },
  { day: "Wed", total: 1760, fraud: 8 },
  { day: "Thu", total: 2450, fraud: 31 },
  { day: "Fri", total: 2980, fraud: 27 },
  { day: "Sat", total: 1320, fraud: 6 },
  { day: "Sun", total: 980, fraud: 4 },
];

export const riskDistribution = [
  { label: "Low", pct: 68 },
  { label: "Medium", pct: 22 },
  { label: "High", pct: 10 },
];

export const modelMetrics = [
  { label: "Model Version", value: "v2.4.1" },
  { label: "Accuracy", value: "99.3%" },
  { label: "Precision", value: "98.8%" },
  { label: "Recall", value: "97.9%" },
  { label: "Drift", value: "0.08" },
  { label: "Status", value: "Live" },
];
