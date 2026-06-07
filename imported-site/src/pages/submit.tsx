import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBuildings, useRooms, useCreateIssue } from "@/hooks/useIssuesData";
import { SEVERITY_ORDER, generateId, severityStyles, type Severity } from "@/lib/severity";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Electrical", "Plumbing", "HVAC", "Furniture", "IT/Network", "Safety", "Cleanliness", "Other"];

export default function SubmitPage() {
  const navigate = useNavigate();
  const buildingsQ = useBuildings();
  const roomsQ = useRooms();
  const createIssue = useCreateIssue();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity>("Medium");
  const [category, setCategory] = useState("Other");
  const [reporter, setReporter] = useState("");
  const [buildingId, setBuildingId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const buildings = buildingsQ.data ?? [];
  const rooms = roomsQ.data ?? [];

  const availableRooms = useMemo(
    () => rooms.filter((r) => r.buildingId?.Id === buildingId),
    [rooms, buildingId],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Title is required.");
    if (!reporter.trim()) return setError("Reporter name is required.");
    if (!buildingId) return setError("Please select a building.");

    const today = new Date().toISOString().slice(0, 10);
    try {
      await createIssue.mutateAsync({
        issueId: generateId("iss"),
        title: title.trim(),
        description: description.trim() || undefined,
        severity: { Value: severity },
        status: { Value: "Open" },
        category: { Value: category },
        reporter: reporter.trim(),
        reportedDate: today,
        buildingId: { Id: buildingId, Value: "" },
        roomId: roomId ? { Id: roomId, Value: "" } : undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate("/issues"), 900);
    } catch (err: any) {
      setError(err?.message ?? "Failed to submit issue.");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto" data-pa-control-id="src/pages/submit.tsx:68:5-224:11">
      <div data-pa-control-id="src/pages/submit.tsx:69:7-74:13">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-pa-control-id="src/pages/submit.tsx:70:9-70:91" data-pa-text-content-editable="true">Report an Issue</h1>
        <p className="text-sm text-muted-foreground mt-1" data-pa-control-id="src/pages/submit.tsx:71:9-73:13" data-pa-text-content-editable="true">
          Help facilities respond quickly by providing as much detail as possible.
        </p>
      </div>

      <Card data-pa-control-id="src/pages/submit.tsx:76:7-223:14">
        <CardHeader data-pa-control-id="src/pages/submit.tsx:77:9-80:22">
          <CardTitle data-pa-control-id="src/pages/submit.tsx:78:11-78:43" data-pa-text-content-editable="true">New issue</CardTitle>
          <CardDescription data-pa-control-id="src/pages/submit.tsx:79:11-79:84" data-pa-text-content-editable="true">All fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent data-pa-control-id="src/pages/submit.tsx:81:9-222:23">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center" data-pa-control-id="src/pages/submit.tsx:83:13-89:19">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3" data-pa-control-id="src/pages/submit.tsx:84:15-86:21">
                <CheckCircle2 className="size-7" />
              </div>
              <h2 className="text-lg font-semibold" data-pa-control-id="src/pages/submit.tsx:87:15-87:74" data-pa-text-content-editable="true">Issue submitted!</h2>
              <p className="text-sm text-muted-foreground mt-1" data-pa-control-id="src/pages/submit.tsx:88:15-88:100" data-pa-text-content-editable="true">Redirecting to the issues list…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2" data-pa-control-id="src/pages/submit.tsx:92:15-101:21">
                <Label htmlFor="title" data-pa-control-id="src/pages/submit.tsx:93:17-93:55" data-pa-text-content-editable="true">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Broken AC in conference room"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2" data-pa-control-id="src/pages/submit.tsx:103:15-112:21">
                <Label htmlFor="description" data-pa-control-id="src/pages/submit.tsx:104:17-104:65" data-pa-text-content-editable="true">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about what's wrong, when it started, etc."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-pa-control-id="src/pages/submit.tsx:114:15-150:21">
                <div className="space-y-2" data-pa-control-id="src/pages/submit.tsx:115:17-135:23">
                  <Label data-pa-control-id="src/pages/submit.tsx:116:19-116:44" data-pa-text-content-editable="true">Severity *</Label>
                  <div className="grid grid-cols-2 gap-2" data-pa-control-id="src/pages/submit.tsx:117:19-134:25">
                    {SEVERITY_ORDER.map((sev) => (
                      <button type="button" key={sev} onClick={() => setSeverity(sev)} className={cn("flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-all", severity === sev
        ? cn(severityStyles[sev].bg, severityStyles[sev].text, severityStyles[sev].ring, "ring-2")
        : "border-border hover:bg-accent/30")} data-pa-control-id="src/pages/submit.tsx:119:23-132:32">
                        <span className={cn("size-2 rounded-full", severityStyles[sev].dot)} data-pa-control-id="src/pages/submit.tsx:130:25-130:96"/>
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2" data-pa-control-id="src/pages/submit.tsx:137:17-149:23">
                  <Label htmlFor="category" data-pa-control-id="src/pages/submit.tsx:138:19-138:61" data-pa-text-content-editable="true">Category</Label>
                  <select
                    id="category"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-pa-control-id="src/pages/submit.tsx:152:15-192:21">
                <div className="space-y-2" data-pa-control-id="src/pages/submit.tsx:153:17-173:23">
                  <Label htmlFor="building" data-pa-control-id="src/pages/submit.tsx:154:19-154:63" data-pa-text-content-editable="true">Building *</Label>
                  <select
                    id="building"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                    value={buildingId ?? ""}
                    onChange={(e) => {
                      const v = e.target.value ? Number(e.target.value) : null;
                      setBuildingId(v);
                      setRoomId(null);
                    }}
                    required
                  >
                    <option value="">Select a building…</option>
                    {buildings.map((b) => (
                      <option key={b.ID} value={b.ID}>
                        {b.name} · {b.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2" data-pa-control-id="src/pages/submit.tsx:175:17-191:23">
                  <Label htmlFor="room" data-pa-control-id="src/pages/submit.tsx:176:19-176:53" data-pa-text-content-editable="true">Room</Label>
                  <select
                    id="room"
                    disabled={!buildingId}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none disabled:opacity-50"
                    value={roomId ?? ""}
                    onChange={(e) => setRoomId(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">{buildingId ? "Select a room…" : "Select a building first"}</option>
                    {availableRooms.map((r) => (
                      <option key={r.ID} value={r.ID}>
                        {r.name}{r.floor ? ` · Floor ${r.floor}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2" data-pa-control-id="src/pages/submit.tsx:194:15-203:21">
                <Label htmlFor="reporter" data-pa-control-id="src/pages/submit.tsx:195:17-195:62" data-pa-text-content-editable="true">Your name *</Label>
                <Input
                  id="reporter"
                  placeholder="Daniel Budimir"
                  value={reporter}
                  onChange={(e) => setReporter(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2 border border-destructive/30" data-pa-control-id="src/pages/submit.tsx:206:17-208:23">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2" data-pa-control-id="src/pages/submit.tsx:211:15-219:21">
                <Button type="button" variant="outline" onClick={() => navigate("/issues")} data-pa-control-id="src/pages/submit.tsx:212:17-214:26" data-pa-text-content-editable="true">
                  Cancel
                </Button>
                <Button type="submit" disabled={createIssue.isPending} data-pa-control-id="src/pages/submit.tsx:215:17-218:26">
                  <Send className="size-4" />
                  {createIssue.isPending ? "Submitting…" : "Submit issue"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

