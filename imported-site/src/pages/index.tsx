import { Link } from "react-router-dom";
import { AlertTriangle, Activity, ListChecks, MapPin, Plus, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useIssues, useBuildings, useRooms } from "@/hooks/useIssuesData";
import { SEVERITY_ORDER, severityStyles, type Severity } from "@/lib/severity";
import { SeverityDonut } from "@/components/SeverityDonut";
import { BuildingBars } from "@/components/BuildingBars";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";

export default function DashboardPage() {
  const issuesQ = useIssues();
  const buildingsQ = useBuildings();
  const roomsQ = useRooms();

  const issues = issuesQ.data ?? [];
  const buildings = buildingsQ.data ?? [];
  const rooms = roomsQ.data ?? [];

  const unresolved = issues.filter((i) => i.status.Value !== "Resolved");
  const total = unresolved.length;
  const critical = unresolved.filter((i) => i.severity.Value === "Critical").length;
  const inProgress = issues.filter((i) => i.status.Value === "In Progress").length;
  const resolved = issues.filter((i) => i.status.Value === "Resolved").length;

  const severityCounts: Record<Severity, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  unresolved.forEach((i) => {
    const sev = i.severity.Value as Severity;
    if (severityCounts[sev] !== undefined) severityCounts[sev]++;
  });

  const buildingCounts = buildings
    .map((b) => ({
      name: b.name,
      location: b.location,
      count: unresolved.filter((i) => i.buildingId?.Id === b.ID).length,
    }))
    .sort((a, b) => b.count - a.count);

  const roomCounts = rooms
    .map((r) => {
      const building = buildings.find((b) => b.ID === r.buildingId?.Id);
      return {
        room: r,
        building,
        count: unresolved.filter((i) => i.roomId?.Id === r.ID).length,
      };
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const recent = [...issues]
    .sort((a, b) => (b.reportedDate ?? "").localeCompare(a.reportedDate ?? ""))
    .slice(0, 5);

  const isLoading = issuesQ.isLoading || buildingsQ.isLoading || roomsQ.isLoading;
  const hasError = issuesQ.error || buildingsQ.error || roomsQ.error;

  return (
    <div className="space-y-6" data-pa-control-id="src/pages/index.tsx:63:5-259:11">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white p-6 md:p-8 shadow-lg" data-pa-control-id="src/pages/index.tsx:65:7-85:13">
        <div className="absolute -top-10 -right-10 size-48 rounded-full bg-white/10 blur-2xl" data-pa-control-id="src/pages/index.tsx:66:9-66:97"/>
        <div className="absolute -bottom-12 -left-12 size-56 rounded-full bg-rose-400/30 blur-2xl" data-pa-control-id="src/pages/index.tsx:67:9-67:102"/>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4" data-pa-control-id="src/pages/index.tsx:68:9-84:15">
          <div data-pa-control-id="src/pages/index.tsx:69:11-77:17">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur" data-pa-control-id="src/pages/index.tsx:70:13-72:19">
              <Sparkles className="size-3.5" /> Live operations overview
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight" data-pa-control-id="src/pages/index.tsx:73:13-73:94" data-pa-text-content-editable="true">Dashboard</h1>
            <p className="mt-1 text-white/80 max-w-xl text-sm" data-pa-control-id="src/pages/index.tsx:74:13-76:17" data-pa-text-content-editable="true">
              Monitor unresolved facility issues across all company buildings, severities, and rooms in real time.
            </p>
          </div>
          <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-white/90 shadow-md" data-pa-control-id="src/pages/index.tsx:78:11-83:20">
            <Link to="/submit" data-pa-control-id="src/pages/index.tsx:79:13-82:20">
              <Plus className="size-4" />
              Report Issue
            </Link>
          </Button>
        </div>
      </div>

      {hasError && (
        <Card className="border-destructive/40 bg-destructive/5" data-pa-control-id="src/pages/index.tsx:88:9-90:16">
          <CardContent className="text-sm text-destructive" data-pa-control-id="src/pages/index.tsx:89:11-89:118" data-pa-text-content-editable="true">Failed to load some data. Please try again.</CardContent>
        </Card>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-pa-control-id="src/pages/index.tsx:94:7-123:13">
        <KpiCard
          label="Unresolved"
          value={total}
          icon={<AlertTriangle className="size-4" />}
          tone="from-indigo-500 to-violet-500"
          loading={isLoading}
        />
        <KpiCard
          label="Critical"
          value={critical}
          icon={<TrendingUp className="size-4" />}
          tone="from-rose-500 to-orange-500"
          loading={isLoading}
        />
        <KpiCard
          label="In Progress"
          value={inProgress}
          icon={<Activity className="size-4" />}
          tone="from-amber-400 to-orange-500"
          loading={isLoading}
        />
        <KpiCard
          label="Resolved"
          value={resolved}
          icon={<ListChecks className="size-4" />}
          tone="from-emerald-500 to-teal-500"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" data-pa-control-id="src/pages/index.tsx:125:7-176:13">
        {/* Severity breakdown */}
        <Card className="lg:col-span-1" data-pa-control-id="src/pages/index.tsx:127:9-153:16">
          <CardHeader data-pa-control-id="src/pages/index.tsx:128:11-131:24">
            <CardTitle data-pa-control-id="src/pages/index.tsx:129:13-129:47" data-pa-text-content-editable="true">By Severity</CardTitle>
            <CardDescription data-pa-control-id="src/pages/index.tsx:130:13-130:65" data-pa-text-content-editable="true">Unresolved issues</CardDescription>
          </CardHeader>
          <CardContent data-pa-control-id="src/pages/index.tsx:132:11-152:25">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4" data-pa-control-id="src/pages/index.tsx:134:15-137:21">
                <Skeleton className="h-44 w-44 rounded-full" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <SeverityDonut counts={severityCounts} />
                <ul className="mt-4 grid grid-cols-2 gap-2">
                  {SEVERITY_ORDER.map((sev) => (
                    <li key={sev} className="flex items-center gap-2 text-xs">
                      <span className={`size-2.5 rounded-full ${severityStyles[sev].dot}`} data-pa-control-id="src/pages/index.tsx:144:23-144:94"/>
                      <span className="text-muted-foreground" data-pa-control-id="src/pages/index.tsx:145:23-145:75">{sev}</span>
                      <span className="ml-auto font-semibold tabular-nums" data-pa-control-id="src/pages/index.tsx:146:23-146:104">{severityCounts[sev]}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        {/* Building breakdown */}
        <Card className="lg:col-span-2" data-pa-control-id="src/pages/index.tsx:156:9-175:16">
          <CardHeader data-pa-control-id="src/pages/index.tsx:157:11-160:24">
            <CardTitle data-pa-control-id="src/pages/index.tsx:158:13-158:47" data-pa-text-content-editable="true">By Building</CardTitle>
            <CardDescription data-pa-control-id="src/pages/index.tsx:159:13-159:78" data-pa-text-content-editable="true">Unresolved issues per building</CardDescription>
          </CardHeader>
          <CardContent data-pa-control-id="src/pages/index.tsx:161:11-174:25">
            {isLoading ? (
              <div className="space-y-3" data-pa-control-id="src/pages/index.tsx:163:15-170:21">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2" data-pa-control-id="src/pages/index.tsx:165:19-168:25">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <BuildingBars data={buildingCounts} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-pa-control-id="src/pages/index.tsx:178:7-258:13">
        {/* Top rooms */}
        <Card data-pa-control-id="src/pages/index.tsx:180:9-220:16">
          <CardHeader data-pa-control-id="src/pages/index.tsx:181:11-184:24">
            <CardTitle data-pa-control-id="src/pages/index.tsx:182:13-182:45" data-pa-text-content-editable="true">Top Rooms</CardTitle>
            <CardDescription data-pa-control-id="src/pages/index.tsx:183:13-183:85" data-pa-text-content-editable="true">Rooms with the most unresolved issues</CardDescription>
          </CardHeader>
          <CardContent data-pa-control-id="src/pages/index.tsx:185:11-219:25">
            {isLoading ? (
              <div className="space-y-3" data-pa-control-id="src/pages/index.tsx:187:15-191:21">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : roomCounts.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center" data-pa-control-id="src/pages/index.tsx:193:15-193:97" data-pa-text-content-editable="true">All clear 🎉</div>
            ) : (
              <ul className="space-y-2">
                {roomCounts.map(({ room, building, count }) => (
                  <li
                    key={room.ID}
                    className="flex items-center justify-between rounded-lg border border-border/60 p-3 hover:bg-accent/30 transition-colors"
                  >
                    <div className="min-w-0" data-pa-control-id="src/pages/index.tsx:201:21-208:27">
                      <p className="font-medium truncate" data-pa-control-id="src/pages/index.tsx:202:23-202:74">{room.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 truncate" data-pa-control-id="src/pages/index.tsx:203:23-207:27">
                        <MapPin className="size-3" />
                        {building?.name ?? "Unknown building"}
                        {room.floor ? <span data-pa-control-id="src/pages/index.tsx:206:39-206:72">· Floor {room.floor}</span> : null}
                      </p>
                    </div>
                    <div className="flex items-center gap-2" data-pa-control-id="src/pages/index.tsx:209:21-214:27">
                      <span className="text-xs text-muted-foreground" data-pa-control-id="src/pages/index.tsx:210:23-210:84" data-pa-text-content-editable="true">issues</span>
                      <span className="inline-flex items-center justify-center min-w-8 h-7 px-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-sm font-semibold" data-pa-control-id="src/pages/index.tsx:211:23-213:30">
                        {count}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card data-pa-control-id="src/pages/index.tsx:223:9-257:16">
          <CardHeader data-pa-control-id="src/pages/index.tsx:224:11-227:24">
            <CardTitle data-pa-control-id="src/pages/index.tsx:225:13-225:50" data-pa-text-content-editable="true">Recent Reports</CardTitle>
            <CardDescription data-pa-control-id="src/pages/index.tsx:226:13-226:71" data-pa-text-content-editable="true">Latest issues submitted</CardDescription>
          </CardHeader>
          <CardContent data-pa-control-id="src/pages/index.tsx:228:11-256:25">
            {isLoading ? (
              <div className="space-y-3" data-pa-control-id="src/pages/index.tsx:230:15-234:21">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {recent.map((issue) => (
                  <li
                    key={issue.ID}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
                  >
                    <div className="min-w-0" data-pa-control-id="src/pages/index.tsx:242:21-247:27">
                      <p className="font-medium truncate" data-pa-control-id="src/pages/index.tsx:243:23-243:76">{issue.title}</p>
                      <p className="text-xs text-muted-foreground truncate" data-pa-control-id="src/pages/index.tsx:244:23-246:27">
                        {issue.reporter} · {issue.reportedDate ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0" data-pa-control-id="src/pages/index.tsx:248:21-251:27">
                      <SeverityBadge severity={issue.severity.Value as Severity} />
                      <StatusBadge status={issue.status.Value as any} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
  tone,
  loading,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: string;
  loading: boolean;
}) {
  return (
    <Card className="overflow-hidden relative" data-pa-control-id="src/pages/index.tsx:277:5-294:12">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone}`} data-pa-control-id="src/pages/index.tsx:278:7-278:82"/>
      <CardContent className="pt-6" data-pa-control-id="src/pages/index.tsx:279:7-293:21">
        <div className="flex items-start justify-between" data-pa-control-id="src/pages/index.tsx:280:9-292:15">
          <div data-pa-control-id="src/pages/index.tsx:281:11-288:17">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium" data-pa-control-id="src/pages/index.tsx:282:13-282:105">{label}</p>
            {loading ? (
              <Skeleton className="h-9 w-16 mt-2" />
            ) : (
              <p className="text-3xl font-bold tabular-nums mt-1" data-pa-control-id="src/pages/index.tsx:286:15-286:78">{value}</p>
            )}
          </div>
          <div className={`flex items-center justify-center size-9 rounded-lg bg-gradient-to-br ${tone} text-white shadow-sm`} data-pa-control-id="src/pages/index.tsx:289:11-291:17">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

