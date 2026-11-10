import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import FAQ from "./pages/FAQ";
import Security from "./pages/Security";
import Company from "./pages/Company";
import Love from "./pages/Love";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import Docs from "./pages/Docs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import ConnectionsPage from "./pages/dashboard/ConnectionsPage";
import EndUsersPage from "./pages/dashboard/EndUsersPage";
import ApiKeysPage from "./pages/dashboard/ApiKeysPage";
import RequestsPage from "./pages/dashboard/RequestsPage";
import LogsPage from "./pages/dashboard/LogsPage";
import WebhooksPage from "./pages/dashboard/WebhooksPage";
import ErrorsPage from "./pages/dashboard/ErrorsPage";
import UsagePage from "./pages/dashboard/UsagePage";
import BillingPage from "./pages/dashboard/BillingPage";
import TeamPage from "./pages/dashboard/TeamPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import SyncStatusPage from "./pages/dashboard/SyncStatusPage";
import ObjectsPage from "./pages/dashboard/ObjectsPage";
import AuthFlowsPage from "./pages/dashboard/AuthFlowsPage";
import IntegrationsPage from "./pages/dashboard/IntegrationsPage";
import EnvironmentsPage from "./pages/dashboard/EnvironmentsPage";
import AuditLogPage from "./pages/dashboard/AuditLogPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import DashboardSupportPage from "./pages/dashboard/DashboardSupportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/security" element={<Security />} />
            <Route path="/company" element={<Company />} />
            <Route path="/company/values" element={<Company />} />
            <Route path="/love" element={<Love />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/support" element={<Support />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/docs/quickstart" element={<Docs />} />
            <Route path="/docs/help" element={<Docs />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Support />} />
            <Route path="/community" element={<Support />} />
            <Route path="/status" element={<Support />} />
            <Route path="/trust" element={<Security />} />
            <Route path="/integrations/quickbooks-desktop" element={<Docs />} />
            <Route path="/integrations/quickbooks-enterprise" element={<Docs />} />
          </Route>

          {/* Auth pages (no layout) */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="connections" element={<ConnectionsPage />} />
            <Route path="end-users" element={<EndUsersPage />} />
            <Route path="api-keys" element={<ApiKeysPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="webhooks" element={<WebhooksPage />} />
            <Route path="auth-flows" element={<AuthFlowsPage />} />
            <Route path="objects" element={<ObjectsPage />} />
            <Route path="sync-status" element={<SyncStatusPage />} />
            <Route path="errors" element={<ErrorsPage />} />
            <Route path="usage" element={<UsagePage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="environments" element={<EnvironmentsPage />} />
            <Route path="audit-log" element={<AuditLogPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="support" element={<DashboardSupportPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
