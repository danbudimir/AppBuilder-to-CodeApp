export type Severity = "Low" | "Medium" | "High" | "Critical";
export type Status = "Open" | "In Progress" | "Resolved";

export const SEVERITY_ORDER: Severity[] = ["Critical", "High", "Medium", "Low"];
export const STATUS_ORDER: Status[] = ["Open", "In Progress", "Resolved"];

export const severityStyles: Record<Severity, { bg: string; text: string; ring: string; dot: string; hex: string }> = {
  Critical: {
    bg: "bg-[color:var(--sev-critical)]/10",
    text: "text-[color:var(--sev-critical)]",
    ring: "ring-1 ring-[color:var(--sev-critical)]/30",
    dot: "bg-[color:var(--sev-critical)]",
    hex: "oklch(0.6 0.24 25)",
  },
  High: {
    bg: "bg-[color:var(--sev-high)]/10",
    text: "text-[color:var(--sev-high)]",
    ring: "ring-1 ring-[color:var(--sev-high)]/30",
    dot: "bg-[color:var(--sev-high)]",
    hex: "oklch(0.72 0.18 50)",
  },
  Medium: {
    bg: "bg-[color:var(--sev-medium)]/15",
    text: "text-[color:var(--sev-medium)]",
    ring: "ring-1 ring-[color:var(--sev-medium)]/30",
    dot: "bg-[color:var(--sev-medium)]",
    hex: "oklch(0.78 0.16 90)",
  },
  Low: {
    bg: "bg-[color:var(--sev-low)]/10",
    text: "text-[color:var(--sev-low)]",
    ring: "ring-1 ring-[color:var(--sev-low)]/30",
    dot: "bg-[color:var(--sev-low)]",
    hex: "oklch(0.7 0.16 220)",
  },
};

export const statusStyles: Record<Status, { bg: string; text: string; dot: string }> = {
  Open: {
    bg: "bg-rose-100",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
  "In Progress": {
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  Resolved: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
};

export const generateId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
};

