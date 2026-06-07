import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import Layout from "./pages/_layout";
import { queryClient } from "./lib/query-client";
import { AppProviders } from "@/components/system/AppProviders";
import HomePage from "./pages/index";
import IssuesPage from "./pages/issues";
import SubmitPage from "./pages/submit";
import BuildingsPage from "./pages/buildings";
import AccountsPage from "./pages/accounts";
import NotFoundPage from "./pages/not-found";
import { AppErrorBoundary } from "./components/system/AppErrorBoundary";

// NOTE(ai): DO NOT REMOVE — (ROUTER BASE) keep this or deep links for playback under /<id>/ in bizchat break.
function getBase(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  return parts.length ? `/${parts[0]}` : "/";
}
// NOTE(ai): DO NOT REMOVE - used by Router
const APP_BASENAME = getBase(window.location.pathname);

function App() {
  return (
    <AppProviders>
      <QueryClientProvider client={queryClient}>
        {/* NOTE(ai): DO NOT REMOVE - Single router lives here. Do not wrap App elsewhere. Do not modify basename */}
        <Router basename={APP_BASENAME}>
          {/* NOTE(ai): DO NOT REMOVE — React error boundary */}
          <AppErrorBoundary>
            <Suspense fallback={<div className="p-4 text-sm text-muted-foreground" data-pa-control-id="src/App.tsx:30:33-30:98" data-pa-text-content-editable="true">Loading…</div>}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="issues" element={<IssuesPage />} />
                  <Route path="submit" element={<SubmitPage />} />
                  <Route path="buildings" element={<BuildingsPage />} />
                  <Route path="accounts" element={<AccountsPage />} />
                  {/* NOTE(ai): DO NOT REMOVE — catch-all 404 page */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </AppErrorBoundary>
        </Router>
      </QueryClientProvider>
    </AppProviders>
  );
}

export default App;

