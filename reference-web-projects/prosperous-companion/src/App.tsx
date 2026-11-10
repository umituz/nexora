import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DataProvider } from "@/contexts/DataContext";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { lazy, Suspense } from "react";
import NotFound from "./pages/NotFound";
const LandingPage = lazy(() => import("./pages/LandingPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CampaignsPage = lazy(() => import("./pages/CampaignsPage"));
const CampaignDetailPage = lazy(() => import("./pages/CampaignDetailPage"));
const LeadsPage = lazy(() => import("./pages/LeadsPage"));
const LeadDetailPage = lazy(() => import("./pages/LeadDetailPage"));
const LeadFinderPage = lazy(() => import("./pages/LeadFinderPage"));
const InboxPage = lazy(() => import("./pages/InboxPage"));
const AITemplatesPage = lazy(() => import("./pages/AITemplatesPage"));
const VoiceNotesPage = lazy(() => import("./pages/VoiceNotesPage"));
const LinkedInAccountsPage = lazy(() => import("./pages/LinkedInAccountsPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const ProxiesPage = lazy(() => import("./pages/ProxiesPage"));
const IntegrationsPage = lazy(() => import("./pages/IntegrationsPage"));
const WebhooksPage = lazy(() => import("./pages/WebhooksPage"));
const ApiKeysPage = lazy(() => import("./pages/ApiKeysPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const BlacklistPage = lazy(() => import("./pages/BlacklistPage"));
const TagsPage = lazy(() => import("./pages/TagsPage"));
const ExportsPage = lazy(() => import("./pages/ExportsPage"));
const ActivityLogPage = lazy(() => import("./pages/ActivityLogPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const BillingPage = lazy(() => import("./pages/BillingPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/campaigns" element={<CampaignsPage />} />
                  <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
                  <Route path="/leads" element={<LeadsPage />} />
                  <Route path="/leads/finder" element={<LeadFinderPage />} />
                  <Route path="/leads/:id" element={<LeadDetailPage />} />
                  <Route path="/inbox" element={<InboxPage />} />
                  <Route path="/ai-templates" element={<AITemplatesPage />} />
                  <Route path="/voice-notes" element={<VoiceNotesPage />} />
                  <Route path="/linkedin-accounts" element={<LinkedInAccountsPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/proxies" element={<ProxiesPage />} />
                  <Route path="/integrations" element={<IntegrationsPage />} />
                  <Route path="/webhooks" element={<WebhooksPage />} />
                  <Route path="/api-keys" element={<ApiKeysPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/blacklist" element={<BlacklistPage />} />
                  <Route path="/tags" element={<TagsPage />} />
                  <Route path="/exports" element={<ExportsPage />} />
                  <Route path="/activity-log" element={<ActivityLogPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/billing" element={<BillingPage />} />
                  <Route path="/support" element={<SupportPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
