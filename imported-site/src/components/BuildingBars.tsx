import { Building2 } from "lucide-react";

export function BuildingBars({ data }: { data: { name: string; count: number; location: string }[] }) {
  if (data.length === 0) {
    return <div className="text-sm text-muted-foreground" data-pa-control-id="src/components/BuildingBars.tsx:5:12-5:88" data-pa-text-content-editable="true">No unresolved issues 🎉</div>;
  }
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-3" data-pa-control-id="src/components/BuildingBars.tsx:9:5-31:11">
      {data.map((d) => {
        const pct = (d.count / max) * 100;
        return (
          <div key={d.name} data-pa-control-id="src/components/BuildingBars.tsx:13:11-28:17">
            <div className="flex items-center justify-between text-sm mb-1" data-pa-control-id="src/components/BuildingBars.tsx:14:13-21:19">
              <div className="flex items-center gap-2 min-w-0" data-pa-control-id="src/components/BuildingBars.tsx:15:15-19:21">
                <Building2 className="size-3.5 text-indigo-500 shrink-0" />
                <span className="font-medium truncate" data-pa-control-id="src/components/BuildingBars.tsx:17:17-17:71">{d.name}</span>
                <span className="text-xs text-muted-foreground truncate" data-pa-control-id="src/components/BuildingBars.tsx:18:17-18:95">· {d.location}</span>
              </div>
              <span className="font-semibold tabular-nums" data-pa-control-id="src/components/BuildingBars.tsx:20:15-20:76">{d.count}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden" data-pa-control-id="src/components/BuildingBars.tsx:22:13-27:19">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 transition-[width] duration-500" style={{ width: `${pct}%` }} data-pa-control-id="src/components/BuildingBars.tsx:23:15-26:17"/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

