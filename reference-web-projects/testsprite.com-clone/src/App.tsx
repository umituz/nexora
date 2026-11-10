import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import HomePage from "@/pages/HomePage";
import PricingPage from "@/pages/PricingPage";
import AboutPage from "@/pages/AboutPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import ContactPage from "@/pages/ContactPage";
import DocsPage from "@/pages/DocsPage";
import SolutionPage from "@/pages/SolutionPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import HackathonPage from "@/pages/HackathonPage";
import ChangelogPage from "@/pages/ChangelogPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import DashboardOverview from "@/pages/dashboard/DashboardOverview";
import ProjectsPage from "@/pages/dashboard/ProjectsPage";
import TestRunsPage from "@/pages/dashboard/TestRunsPage";
import TestCasesPage from "@/pages/dashboard/TestCasesPage";
import TestReportsPage from "@/pages/dashboard/TestReportsPage";
import ApiTestingPage from "@/pages/dashboard/ApiTestingPage";
import UiTestingPage from "@/pages/dashboard/UiTestingPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import CiCdPage from "@/pages/dashboard/CiCdPage";
import RegressionPage from "@/pages/dashboard/RegressionPage";
import ScheduledPage from "@/pages/dashboard/ScheduledPage";
import HistoryPage from "@/pages/dashboard/HistoryPage";
import EnvironmentsPage from "@/pages/dashboard/EnvironmentsPage";
import VariablesPage from "@/pages/dashboard/VariablesPage";
import WebhooksPage from "@/pages/dashboard/WebhooksPage";
import CoveragePage from "@/pages/dashboard/CoveragePage";
import BugReportsPage from "@/pages/dashboard/BugReportsPage";
import McpConfigPage from "@/pages/dashboard/McpConfigPage";
import AuditLogPage from "@/pages/dashboard/AuditLogPage";
import HelpPage from "@/pages/dashboard/HelpPage";
import {
  SettingsLayout, SettingsGeneral, SettingsProfile, SettingsBilling,
  SettingsTeam, SettingsIntegrations, SettingsNotifications, SettingsApiKeys,
} from "@/pages/dashboard/SettingsPages";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/NotFound";

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
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/solutions/:type" element={<SolutionPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/hackathon" element={<HackathonPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Route>

          {/* Dashboard pages (auth required) */}
          <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="test-runs" element={<TestRunsPage />} />
            <Route path="test-cases" element={<TestCasesPage />} />
            <Route path="test-reports" element={<TestReportsPage />} />
            <Route path="api-testing" element={<ApiTestingPage />} />
            <Route path="ui-testing" element={<UiTestingPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="cicd" element={<CiCdPage />} />
            <Route path="regression" element={<RegressionPage />} />
            <Route path="scheduled" element={<ScheduledPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="environments" element={<EnvironmentsPage />} />
            <Route path="variables" element={<VariablesPage />} />
            <Route path="webhooks" element={<WebhooksPage />} />
            <Route path="coverage" element={<CoveragePage />} />
            <Route path="bug-reports" element={<BugReportsPage />} />
            <Route path="mcp-config" element={<McpConfigPage />} />
            <Route path="audit-log" element={<AuditLogPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<SettingsGeneral />} />
              <Route path="profile" element={<SettingsProfile />} />
              <Route path="billing" element={<SettingsBilling />} />
              <Route path="team" element={<SettingsTeam />} />
              <Route path="integrations" element={<SettingsIntegrations />} />
              <Route path="notifications" element={<SettingsNotifications />} />
              <Route path="api-keys" element={<SettingsApiKeys />} />
          </Route>
          </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
