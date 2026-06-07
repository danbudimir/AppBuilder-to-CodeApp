import { useState } from "react";
import { Building2, MapPin, DoorOpen, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIssues, useBuildings, useRooms } from "@/hooks/useIssuesData";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import type { Severity, Status } from "@/lib/severity";
import { cn } from "@/lib/utils";

export default function BuildingsPage() {
  const issuesQ = useIssues();
  const buildingsQ = useBuildings();
  const roomsQ = useRooms();

  const issues = issuesQ.data ?? [];
  const buildings = buildingsQ.data ?? [];
  const rooms = roomsQ.data ?? [];

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const isLoading = issuesQ.isLoading || buildingsQ.isLoading || roomsQ.isLoading;

  const buildingStats = buildings.map((b) => {
    const buildingRooms = rooms.filter((r) => r.buildingId?.Id === b.ID);
    const buildingIssues = issues.filter((i) => i.buildingId?.Id === b.ID);
    const unresolved = buildingIssues.filter((i) => i.status.Value !== "Resolved");
    const critical = unresolved.filter((i) => i.severity.Value === "Critical").length;
    return { building: b, rooms: buildingRooms, issues: buildingIssues, unresolved, critical };
  });

  const selected = buildingStats.find((s) => s.building.ID === selectedId) ?? null;

  return (
    <div className="space-y-6" data-pa-control-id="src/pages/buildings.tsx:35:5-179:11">
      <div data-pa-control-id="src/pages/buildings.tsx:36:7-41:13">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-pa-control-id="src/pages/buildings.tsx:37:9-37:85" data-pa-text-content-editable="true">Buildings</h1>
        <p className="text-sm text-muted-foreground mt-1" data-pa-control-id="src/pages/buildings.tsx:38:9-40:13" data-pa-text-content-editable="true">
          Explore facilities and drill down into rooms to see unresolved issues.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-pa-control-id="src/pages/buildings.tsx:44:9-48:15">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-pa-control-id="src/pages/buildings.tsx:50:9-94:15">
          {buildingStats.map(({ building, rooms: bRooms, unresolved, critical }) => {
            const active = selectedId === building.ID;
            return (
              <button key={building.ID} type="button" onClick={() => setSelectedId(active ? null : (building.ID as number))} className={cn("text-left", "rounded-xl border bg-card p-5 transition-all hover:shadow-md", active
        ? "ring-2 ring-indigo-500/40 border-indigo-500/40 shadow-md"
        : "border-border/60")} data-pa-control-id="src/pages/buildings.tsx:54:15-91:24">
                <div className="flex items-start justify-between gap-3" data-pa-control-id="src/pages/buildings.tsx:66:17-85:23">
                  <div className="flex items-center gap-2" data-pa-control-id="src/pages/buildings.tsx:67:19-78:25">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white" data-pa-control-id="src/pages/buildings.tsx:68:21-70:27">
                      <Building2 className="size-4" />
                    </div>
                    <div data-pa-control-id="src/pages/buildings.tsx:71:21-77:27">
                      <p className="font-semibold leading-tight" data-pa-control-id="src/pages/buildings.tsx:72:23-72:85">{building.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1" data-pa-control-id="src/pages/buildings.tsx:73:23-76:27">
                        <MapPin className="size-3" />
                        {building.location}
                      </p>
                    </div>
                  </div>
                  {critical > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--sev-critical)]/10 text-[color:var(--sev-critical)] text-xs font-semibold px-2 py-0.5" data-pa-control-id="src/pages/buildings.tsx:80:21-83:28">
                      <AlertTriangle className="size-3" />
                      {critical} critical
                    </span>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2" data-pa-control-id="src/pages/buildings.tsx:86:17-90:23">
                  <Stat label="Rooms" value={bRooms.length} icon={<DoorOpen className="size-3.5" />} />
                  <Stat label="Unresolved" value={unresolved.length} icon={<AlertTriangle className="size-3.5" />} />
                  <Stat label="Floors" value={building.floors ?? "—"} />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <Card data-pa-control-id="src/pages/buildings.tsx:98:9-177:16">
          <CardHeader data-pa-control-id="src/pages/buildings.tsx:99:11-108:24">
            <CardTitle className="flex items-center gap-2" data-pa-control-id="src/pages/buildings.tsx:100:13-103:25">
              <Building2 className="size-5 text-indigo-500" />
              {selected.building.name}
            </CardTitle>
            <CardDescription data-pa-control-id="src/pages/buildings.tsx:104:13-107:31">
              {selected.building.address ?? selected.building.location} · {selected.rooms.length} rooms ·{" "}
              {selected.unresolved.length} unresolved
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6" data-pa-control-id="src/pages/buildings.tsx:109:11-176:25">
            <div data-pa-control-id="src/pages/buildings.tsx:110:13-145:19">
              <h3 className="text-sm font-semibold mb-2" data-pa-control-id="src/pages/buildings.tsx:111:15-111:68" data-pa-text-content-editable="true">Rooms</h3>
              {selected.rooms.length === 0 ? (
                <p className="text-sm text-muted-foreground" data-pa-control-id="src/pages/buildings.tsx:113:17-113:104" data-pa-text-content-editable="true">No rooms configured for this building.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" data-pa-control-id="src/pages/buildings.tsx:115:17-143:23">
                  {selected.rooms.map((room) => {
                    const count = selected.unresolved.filter((i) => i.roomId?.Id === room.ID).length;
                    return (
                      <div key={room.ID} className="flex items-center justify-between rounded-lg border border-border/60 p-3" data-pa-control-id="src/pages/buildings.tsx:119:23-140:29">
                        <div className="min-w-0" data-pa-control-id="src/pages/buildings.tsx:123:25-129:31">
                          <p className="font-medium truncate" data-pa-control-id="src/pages/buildings.tsx:124:27-124:78">{room.name}</p>
                          <p className="text-xs text-muted-foreground truncate" data-pa-control-id="src/pages/buildings.tsx:125:27-128:31">
                            {room.roomType?.Value ?? "Room"}
                            {room.floor ? ` · Floor ${room.floor}` : ""}
                          </p>
                        </div>
                        <span className={cn("inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full text-xs font-semibold", count > 0
        ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
        : "bg-muted text-muted-foreground")} data-pa-control-id="src/pages/buildings.tsx:130:25-139:32">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div data-pa-control-id="src/pages/buildings.tsx:147:13-175:19">
              <h3 className="text-sm font-semibold mb-2" data-pa-control-id="src/pages/buildings.tsx:148:15-148:86" data-pa-text-content-editable="true">Issues in this building</h3>
              {selected.issues.length === 0 ? (
                <p className="text-sm text-muted-foreground" data-pa-control-id="src/pages/buildings.tsx:150:17-150:103" data-pa-text-content-editable="true">No issues reported for this building.</p>
              ) : (
                <ul className="space-y-2">
                  {selected.issues.map((issue) => {
                    const room = selected.rooms.find((r) => r.ID === issue.roomId?.Id);
                    return (
                      <li
                        key={issue.ID}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
                      >
                        <div className="min-w-0" data-pa-control-id="src/pages/buildings.tsx:160:25-165:31">
                          <p className="font-medium truncate" data-pa-control-id="src/pages/buildings.tsx:161:27-161:80">{issue.title}</p>
                          <p className="text-xs text-muted-foreground truncate" data-pa-control-id="src/pages/buildings.tsx:162:27-164:31">
                            {room?.name ?? "—"} · {issue.reporter} · {issue.reportedDate ?? "—"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0" data-pa-control-id="src/pages/buildings.tsx:166:25-169:31">
                          <SeverityBadge severity={issue.severity.Value as Severity} />
                          <StatusBadge status={issue.status.Value as Status} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number | string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2" data-pa-control-id="src/pages/buildings.tsx:185:5-191:11">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold" data-pa-control-id="src/pages/buildings.tsx:186:7-189:13">
        {icon}
        {label}
      </div>
      <div className="text-base font-bold tabular-nums" data-pa-control-id="src/pages/buildings.tsx:190:7-190:70">{value}</div>
    </div>
  );
}

