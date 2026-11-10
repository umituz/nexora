import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";

// Public pages
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import DocsPage from "./pages/DocsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/ContactPage";
import FeaturePage from "./pages/FeaturePage";

// Dashboard pages
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import ProjectsPage from "./pages/dashboard/ProjectsPage";
import EnvironmentsPage from "./pages/dashboard/EnvironmentsPage";
import DeploymentsPage from "./pages/dashboard/DeploymentsPage";
import DatabasePage from "./pages/dashboard/DatabasePage";
import CollectionsPage from "./pages/dashboard/CollectionsPage";
import IndexesPage from "./pages/dashboard/IndexesPage";
import MigrationsPage from "./pages/dashboard/MigrationsPage";
import AuthUsersPage from "./pages/dashboard/AuthUsersPage";
import SessionsPage from "./pages/dashboard/SessionsPage";
import RolesPage from "./pages/dashboard/RolesPage";
import ProvidersPage from "./pages/dashboard/ProvidersPage";
import LogsPage from "./pages/dashboard/LogsPage";
import MetricsPage from "./pages/dashboard/MetricsPage";
import TracesPage from "./pages/dashboard/TracesPage";
import AlertsPage from "./pages/dashboard/AlertsPage";
import CronJobsPage from "./pages/dashboard/CronJobsPage";
import AppConfigPage from "./pages/dashboard/AppConfigPage";
import SecretsPage from "./pages/dashboard/SecretsPage";
import EnvVarsPage from "./pages/dashboard/EnvVarsPage";
import ApiKeysPage from "./pages/dashboard/ApiKeysPage";
import TeamMembersPage from "./pages/dashboard/TeamMembersPage";
import InvitationsPage from "./pages/dashboard/InvitationsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import ActivityLogPage from "./pages/dashboard/ActivityLogPage";
import IntegrationsPage from "./pages/dashboard/IntegrationsPage";
import StorageBucketsPage from "./pages/dashboard/StorageBucketsPage";
import StorageFilesPage from "./pages/dashboard/StorageFilesPage";
import FunctionsPage from "./pages/dashboard/FunctionsPage";
import QueriesPage from "./pages/dashboard/QueriesPage";
import SettingsGeneralPage from "./pages/dashboard/SettingsGeneralPage";
import BillingPage from "./pages/dashboard/BillingPage";
import DomainsPage from "./pages/dashboard/DomainsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/docs/:slug" element={<DocsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/features/:feature" element={<FeaturePage />} />
            </Route>

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="environments" element={<EnvironmentsPage />} />
              <Route path="deployments" element={<DeploymentsPage />} />
              <Route path="database" element={<DatabasePage />} />
              <Route path="database/collections" element={<CollectionsPage />} />
              <Route path="database/indexes" element={<IndexesPage />} />
              <Route path="database/migrations" element={<MigrationsPage />} />
              <Route path="auth/users" element={<AuthUsersPage />} />
              <Route path="auth/sessions" element={<SessionsPage />} />
              <Route path="auth/roles" element={<RolesPage />} />
              <Route path="auth/providers" element={<ProvidersPage />} />
              <Route path="monitoring/logs" element={<LogsPage />} />
              <Route path="monitoring/metrics" element={<MetricsPage />} />
              <Route path="monitoring/traces" element={<TracesPage />} />
              <Route path="monitoring/alerts" element={<AlertsPage />} />
              <Route path="cron-jobs" element={<CronJobsPage />} />
              <Route path="config/app" element={<AppConfigPage />} />
              <Route path="config/secrets" element={<SecretsPage />} />
              <Route path="config/env-vars" element={<EnvVarsPage />} />
              <Route path="api-keys" element={<ApiKeysPage />} />
              <Route path="team/members" element={<TeamMembersPage />} />
              <Route path="team/invitations" element={<InvitationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="activity-log" element={<ActivityLogPage />} />
              <Route path="integrations" element={<IntegrationsPage />} />
              <Route path="storage/buckets" element={<StorageBucketsPage />} />
              <Route path="storage/files" element={<StorageFilesPage />} />
              <Route path="functions" element={<FunctionsPage />} />
              <Route path="queries" element={<QueriesPage />} />
              <Route path="settings/general" element={<SettingsGeneralPage />} />
              <Route path="settings/billing" element={<BillingPage />} />
              <Route path="settings/domains" element={<DomainsPage />} />
              <Route path="settings/notifications" element={<NotificationsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
