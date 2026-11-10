import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MarketingLayout } from "@/layouts/MarketingLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";

// Marketing pages
import HomePage from "@/pages/marketing/HomePage";
import PricingPage from "@/pages/marketing/PricingPage";
import BlogPage from "@/pages/marketing/BlogPage";
import BlogPostPage from "@/pages/marketing/BlogPostPage";
import DocsPage from "@/pages/marketing/DocsPage";
import AboutPage from "@/pages/marketing/AboutPage";
import ContactPage from "@/pages/marketing/ContactPage";
import LoginPage from "@/pages/marketing/LoginPage";
import SignUpPage from "@/pages/marketing/SignUpPage";
import FeaturesPage from "@/pages/marketing/FeaturesPage";
import ChangelogPage from "@/pages/marketing/ChangelogPage";
import SecurityPage from "@/pages/marketing/SecurityPage";
import PrivacyPage from "@/pages/marketing/PrivacyPage";
import TermsPage from "@/pages/marketing/TermsPage";
import CareersPage from "@/pages/marketing/CareersPage";
import ForgotPasswordPage from "@/pages/marketing/ForgotPasswordPage";
import PublicStatusPage from "@/pages/marketing/PublicStatusPage";

// Dashboard pages
import DashboardOverview from "@/pages/dashboard/DashboardOverview";
import ErrorsListPage from "@/pages/dashboard/ErrorsListPage";
import ErrorDetailPage from "@/pages/dashboard/ErrorDetailPage";
import PerformanceListPage from "@/pages/dashboard/PerformanceListPage";
import PerformanceDetailPage from "@/pages/dashboard/PerformanceDetailPage";
import HostMonitoringPage from "@/pages/dashboard/HostMonitoringPage";
import HostDetailPage from "@/pages/dashboard/HostDetailPage";
import AnomalyDetectionPage from "@/pages/dashboard/AnomalyDetectionPage";
import UptimeMonitoringPage from "@/pages/dashboard/UptimeMonitoringPage";
import UptimeDetailPage from "@/pages/dashboard/UptimeDetailPage";
import MetricDashboardsPage from "@/pages/dashboard/MetricDashboardsPage";
import CustomDashboardPage from "@/pages/dashboard/CustomDashboardPage";
import GraphsPage from "@/pages/dashboard/GraphsPage";
import LogManagementPage from "@/pages/dashboard/LogManagementPage";
import LogDetailPage from "@/pages/dashboard/LogDetailPage";
import TimeDetectivePage from "@/pages/dashboard/TimeDetectivePage";
import CheckInsPage from "@/pages/dashboard/CheckInsPage";
import WorkflowPage from "@/pages/dashboard/WorkflowPage";
import DeploysPage from "@/pages/dashboard/DeploysPage";
import NotificationsPage from "@/pages/dashboard/NotificationsPage";
import IntegrationsPage from "@/pages/dashboard/IntegrationsPage";
import AppsPage from "@/pages/dashboard/AppsPage";
import TeamMembersPage from "@/pages/dashboard/TeamMembersPage";
import ApiKeysPage from "@/pages/dashboard/ApiKeysPage";
import BillingPage from "@/pages/dashboard/BillingPage";
import StatusPageDashboard from "@/pages/dashboard/StatusPageDashboard";
import SettingsPage from "@/pages/dashboard/SettingsPage";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Marketing / Public Routes */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/docs/:section" element={<DocsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/status" element={<PublicStatusPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="errors" element={<ErrorsListPage />} />
            <Route path="errors/:id" element={<ErrorDetailPage />} />
            <Route path="performance" element={<PerformanceListPage />} />
            <Route path="performance/:id" element={<PerformanceDetailPage />} />
            <Route path="hosts" element={<HostMonitoringPage />} />
            <Route path="hosts/:id" element={<HostDetailPage />} />
            <Route path="anomalies" element={<AnomalyDetectionPage />} />
            <Route path="uptime" element={<UptimeMonitoringPage />} />
            <Route path="uptime/:id" element={<UptimeDetailPage />} />
            <Route path="metrics" element={<MetricDashboardsPage />} />
            <Route path="custom-dashboard" element={<CustomDashboardPage />} />
            <Route path="graphs" element={<GraphsPage />} />
            <Route path="logs" element={<LogManagementPage />} />
            <Route path="logs/:id" element={<LogDetailPage />} />
            <Route path="time-detective" element={<TimeDetectivePage />} />
            <Route path="check-ins" element={<CheckInsPage />} />
            <Route path="workflow" element={<WorkflowPage />} />
            <Route path="deploys" element={<DeploysPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="apps" element={<AppsPage />} />
            <Route path="team" element={<TeamMembersPage />} />
            <Route path="api-keys" element={<ApiKeysPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="status-page" element={<StatusPageDashboard />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
