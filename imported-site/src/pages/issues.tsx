import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIssues, useBuildings, useRooms, useUpdateIssueStatus } from "@/hooks/useIssuesData";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { SEVERITY_ORDER, STATUS_ORDER, type Severity, type Status } from "@/lib/severity";
import { cn } from "@/lib/utils";

export default function IssuesPage() {
  const issuesQ = useIssues();
  const buildingsQ = useBuildings();
  const roomsQ = useRooms();
  const updateStatus = useUpdateIssueStatus();

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<Severity | "All">("All");
  const [status, setStatus] = useState<Status | "All">("All");
  const [buildingFilter, setBuildingFilter] = useState<number | "All">("All");

  const issues = issuesQ.data ?? [];
  const buildings = buildingsQ.data ?? [];
  const rooms = roomsQ.data ?? [];

  const filtered = useMemo(() => {
    return issues
      .filter((i) => (severity === "All" ? true : i.severity.Value === severity))
      .filter((i) => (status === "All" ? true : i.status.Value === status))
      .filter((i) => (buildingFilter === "All" ? true : i.buildingId?.Id === buildingFilter))
      .filter((i) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          i.title.toLowerCase().includes(q) ||
          (i.description ?? "").toLowerCase().includes(q) ||
          i.reporter.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const sevRank = (s: string) => SEVERITY_ORDER.indexOf(s as Severity);
        const aR = sevRank(a.severity.Value);
        const bR = sevRank(b.severity.Value);
        if (aR !== bR) return aR - bR;
        return (b.reportedDate ?? "").localeCompare(a.reportedDate ?? "");
      });
  }, [issues, search, severity, status, buildingFilter]);

  const isLoading = issuesQ.isLoading || buildingsQ.isLoading || roomsQ.isLoading;

  const handleAdvance = (id: number, current: Status) => {
    const next: Record<Status, Status> = {
      Open: "In Progress",
      "In Progress": "Resolved",
      Resolved: "Open",
    };
    updateStatus.mutate({ id, status: next[current] });
  };

  return (
    <div className="space-y-6" data-pa-control-id="src/pages/issues.tsx:65:5-201:11">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-pa-control-id="src/pages/issues.tsx:66:7-76:13">
        <div data-pa-control-id="src/pages/issues.tsx:67:9-70:15">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-pa-control-id="src/pages/issues.tsx:68:11-68:84" data-pa-text-content-editable="true">Issues</h1>
          <p className="text-sm text-muted-foreground mt-1" data-pa-control-id="src/pages/issues.tsx:69:11-69:108" data-pa-text-content-editable="true">Browse, filter, and triage facility issues.</p>
        </div>
        <Button asChild data-pa-control-id="src/pages/issues.tsx:71:9-75:18">
          <Link to="/submit" data-pa-control-id="src/pages/issues.tsx:72:11-74:18">
            <Plus className="size-4" /> Report Issue
          </Link>
        </Button>
      </div>

      <Card data-pa-control-id="src/pages/issues.tsx:78:7-125:14">
        <CardHeader data-pa-control-id="src/pages/issues.tsx:79:9-85:22">
          <div className="flex items-center gap-2" data-pa-control-id="src/pages/issues.tsx:80:11-83:17">
            <Filter className="size-4 text-muted-foreground" />
            <CardTitle className="text-base" data-pa-control-id="src/pages/issues.tsx:82:13-82:65" data-pa-text-content-editable="true">Filters</CardTitle>
          </div>
          <CardDescription data-pa-control-id="src/pages/issues.tsx:84:11-84:71" data-pa-text-content-editable="true">Refine the list of issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" data-pa-control-id="src/pages/issues.tsx:86:9-124:23">
          <div className="relative" data-pa-control-id="src/pages/issues.tsx:87:11-95:17">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, reporter..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <FilterChips
            label="Severity"
            options={["All", ...SEVERITY_ORDER]}
            value={severity}
            onChange={(v) => setSeverity(v as Severity | "All")}
          />
          <FilterChips
            label="Status"
            options={["All", ...STATUS_ORDER]}
            value={status}
            onChange={(v) => setStatus(v as Status | "All")}
          />
          <div data-pa-control-id="src/pages/issues.tsx:109:11-123:17">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2" data-pa-control-id="src/pages/issues.tsx:110:13-110:111" data-pa-text-content-editable="true">Building</p>
            <div className="flex flex-wrap gap-2" data-pa-control-id="src/pages/issues.tsx:111:13-122:19">
              <Chip active={buildingFilter === "All"} onClick={() => setBuildingFilter("All")}>All</Chip>
              {buildings.map((b) => (
                <Chip
                  key={b.ID}
                  active={buildingFilter === b.ID}
                  onClick={() => setBuildingFilter(b.ID as number)}
                >
                  {b.name}
                </Chip>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-pa-control-id="src/pages/issues.tsx:127:7-200:14">
        <CardHeader data-pa-control-id="src/pages/issues.tsx:128:9-132:22">
          <CardTitle className="text-base" data-pa-control-id="src/pages/issues.tsx:129:11-131:23">
            {isLoading ? "Loading issues…" : `${filtered.length} issue${filtered.length === 1 ? "" : "s"}`}
          </CardTitle>
        </CardHeader>
        <CardContent data-pa-control-id="src/pages/issues.tsx:133:9-199:23">
          {isLoading ? (
            <div className="space-y-2" data-pa-control-id="src/pages/issues.tsx:135:13-139:19">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground py-10 text-center" data-pa-control-id="src/pages/issues.tsx:141:13-141:120" data-pa-text-content-editable="true">No issues match the current filters.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((issue) => {
                  const building = buildings.find((b) => b.ID === issue.buildingId?.Id);
                  const room = rooms.find((r) => r.ID === issue.roomId?.Id);
                  return (
                    <TableRow key={issue.ID}>
                      <TableCell className="max-w-[280px]">
                        <p className="font-medium truncate" data-pa-control-id="src/pages/issues.tsx:162:25-162:78">{issue.title}</p>
                        {issue.description ? (
                          <p className="text-xs text-muted-foreground truncate" data-pa-control-id="src/pages/issues.tsx:164:27-164:104">{issue.description}</p>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <SeverityBadge severity={issue.severity.Value as Severity} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={issue.status.Value as Status} />
                      </TableCell>
                      <TableCell>
                        <p className="text-sm" data-pa-control-id="src/pages/issues.tsx:174:25-174:75">{building?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground" data-pa-control-id="src/pages/issues.tsx:175:25-175:93">{room?.name ?? "—"}</p>
                      </TableCell>
                      <TableCell className="text-sm">{issue.reporter}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{issue.reportedDate ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" disabled={updateStatus.isPending} onClick={() => handleAdvance(issue.ID as number, issue.status.Value as Status)} data-pa-control-id="src/pages/issues.tsx:180:25-191:34">
                          {issue.status.Value === "Open"
                            ? "Start"
                            : issue.status.Value === "In Progress"
                              ? "Resolve"
                              : "Reopen"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FilterChips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div data-pa-control-id="src/pages/issues.tsx:217:5-226:11">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2" data-pa-control-id="src/pages/issues.tsx:218:7-218:104">{label}</p>
      <div className="flex flex-wrap gap-2" data-pa-control-id="src/pages/issues.tsx:219:7-225:13">
        {options.map((opt) => (
          <Chip key={opt} active={value === opt} onClick={() => onChange(opt)}>
            {opt}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all", active
        ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white border-transparent shadow-sm"
        : "bg-background hover:bg-accent/40 border-border text-foreground")} data-pa-control-id="src/pages/issues.tsx:240:5-251:14">
      {children}
    </button>
  );
}

