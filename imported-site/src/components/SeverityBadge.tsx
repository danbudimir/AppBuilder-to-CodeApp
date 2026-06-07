import { severityStyles, type Severity } from "@/lib/severity";
import { cn } from "@/lib/utils";

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const s = severityStyles[severity];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", s.bg, s.text, s.ring, className)} data-pa-control-id="src/components/SeverityBadge.tsx:7:5-18:12">
      <span className={cn("size-1.5 rounded-full", s.dot)} data-pa-control-id="src/components/SeverityBadge.tsx:16:7-16:62"/>
      {severity}
    </span>
  );
}

