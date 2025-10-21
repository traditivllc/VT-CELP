import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import { Toaster } from "sonner";

import { Suspense } from "react";
import ErrorBoundary from "./lib/ErrorBoundary";
import { getEnv } from "./lib/utils";
const PublicRoutes = lazy(() => import("./routes/PublicRoutes"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));

function App() {
  return (
    <BrowserRouter basename={getEnv("ROUTER_BASE_NAME", "")}>
      <Toaster
        position="top-right"
        richColors
        closeButton={true}
        duration={8000}
      />
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/*" element={<PublicRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
