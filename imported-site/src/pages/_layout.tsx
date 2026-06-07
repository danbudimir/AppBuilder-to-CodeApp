import { Outlet, NavLink, Link } from "react-router-dom";
import { LayoutDashboard, ListTodo, PlusCircle, Building2, ShieldAlert, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/issues", label: "Issues", icon: ListTodo },
  { to: "/submit", label: "Report Issue", icon: PlusCircle },
  { to: "/buildings", label: "Buildings", icon: Building2 },
  { to: "/accounts", label: "Accounts", icon: Users },
];

export default function Layout() {
  return (
    <div className="bg-background text-foreground min-h-svh" data-pa-control-id="src/pages/_layout.tsx:14:5-89:11">
      <div className="flex min-h-svh" data-pa-control-id="src/pages/_layout.tsx:15:7-88:13">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60" data-pa-control-id="src/pages/_layout.tsx:17:9-51:17">
          <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border/60" data-pa-control-id="src/pages/_layout.tsx:18:11-26:17">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-md" data-pa-control-id="src/pages/_layout.tsx:19:13-21:19">
              <ShieldAlert className="size-5" />
            </div>
            <Link to="/" className="flex flex-col leading-tight" data-pa-control-id="src/pages/_layout.tsx:22:13-25:20">
              <span className="text-base font-bold tracking-tight" data-pa-control-id="src/pages/_layout.tsx:23:15-23:88" data-pa-text-content-editable="true">FacilityWatch</span>
              <span className="text-[11px] text-muted-foreground" data-pa-control-id="src/pages/_layout.tsx:24:15-24:90" data-pa-text-content-editable="true">Issue monitoring</span>
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-1" aria-label="Primary" data-pa-control-id="src/pages/_layout.tsx:27:11-46:17">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-indigo-500/15 to-fuchsia-500/15 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20"
                      : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                  )
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 text-[11px] text-muted-foreground border-t border-border/60" data-pa-control-id="src/pages/_layout.tsx:47:11-50:17">
            <p className="font-medium text-foreground/80" data-pa-control-id="src/pages/_layout.tsx:48:13-48:66" data-pa-text-content-editable="true">Tip</p>
            <p className="mt-1" data-pa-control-id="src/pages/_layout.tsx:49:13-49:90" data-pa-text-content-editable="true">Use the Dashboard to triage by severity and building.</p>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0" data-pa-control-id="src/pages/_layout.tsx:54:9-87:15">
          <header className="md:hidden border-b border-border/60 bg-card/80 backdrop-blur sticky top-0 z-30" data-pa-control-id="src/pages/_layout.tsx:55:11-82:20">
            <div className="flex h-14 items-center gap-2 px-4" data-pa-control-id="src/pages/_layout.tsx:56:13-61:19">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 text-white" data-pa-control-id="src/pages/_layout.tsx:57:15-59:21">
                <ShieldAlert className="size-4" />
              </div>
              <span className="font-bold tracking-tight" data-pa-control-id="src/pages/_layout.tsx:60:15-60:78" data-pa-text-content-editable="true">FacilityWatch</span>
            </div>
            <nav className="flex gap-1 overflow-x-auto px-2 pb-2" aria-label="Primary mobile" data-pa-control-id="src/pages/_layout.tsx:62:13-81:19">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap",
                      isActive
                        ? "bg-indigo-500/15 text-indigo-700 ring-1 ring-indigo-500/20"
                        : "text-muted-foreground hover:bg-accent/40",
                    )
                  }
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </header>

          <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-7xl w-full mx-auto" data-pa-control-id="src/pages/_layout.tsx:84:11-86:18">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

