import { statusStyles, type Status } from "@/lib/severity";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const s = statusStyles[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", s.bg, s.text, className)} data-pa-control-id="src/components/StatusBadge.tsx:7:5-17:12">
      <span className={cn("size-1.5 rounded-full", s.dot)} data-pa-control-id="src/components/StatusBadge.tsx:15:7-15:62"/>
      {status}
    </span>
  );
}

