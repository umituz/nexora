import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";

import PublicLayout from "@/layouts/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Public pages
import LandingPage from "@/pages/public/LandingPage";
import PricingPage from "@/pages/public/PricingPage";
import FeaturesPage from "@/pages/public/FeaturesPage";
import UseCasesPage from "@/pages/public/UseCasesPage";
import AlternativesPage from "@/pages/public/AlternativesPage";
import AffiliatesPage from "@/pages/public/AffiliatesPage";
import HelpPage from "@/pages/public/HelpPage";
import ContactPage from "@/pages/public/ContactPage";
import AboutPage from "@/pages/public/AboutPage";
import PrivacyPage from "@/pages/public/PrivacyPage";
import TermsPage from "@/pages/public/TermsPage";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Dashboard pages
import DashboardPage from "@/pages/dashboard/DashboardPage";
import AgentsPage from "@/pages/dashboard/AgentsPage";
import AgentCreatePage from "@/pages/dashboard/AgentCreatePage";
import AgentDetailPage from "@/pages/dashboard/AgentDetailPage";
import ConversationsPage from "@/pages/dashboard/ConversationsPage";
import ConversationDetailPage from "@/pages/dashboard/ConversationDetailPage";
import ContactsPage from "@/pages/dashboard/ContactsPage";
import ContactDetailPage from "@/pages/dashboard/ContactDetailPage";
import CampaignsPage from "@/pages/dashboard/CampaignsPage";
import CampaignCreatePage from "@/pages/dashboard/CampaignCreatePage";
import CampaignDetailPage from "@/pages/dashboard/CampaignDetailPage";
import AppointmentsPage from "@/pages/dashboard/AppointmentsPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import ChannelsPage from "@/pages/dashboard/ChannelsPage";
import TemplatesPage from "@/pages/dashboard/TemplatesPage";
import TagsPage from "@/pages/dashboard/TagsPage";
import KnowledgeBasePage from "@/pages/dashboard/KnowledgeBasePage";
import AutomationsPage from "@/pages/dashboard/AutomationsPage";
import LeadScoringPage from "@/pages/dashboard/LeadScoringPage";
import WhiteLabelPage from "@/pages/dashboard/WhiteLabelPage";
import ActivityLogPage from "@/pages/dashboard/ActivityLogPage";
import SettingsGeneralPage from "@/pages/dashboard/SettingsGeneralPage";
import SettingsProfilePage from "@/pages/dashboard/SettingsProfilePage";
import SettingsBillingPage from "@/pages/dashboard/SettingsBillingPage";
import SettingsTeamPage from "@/pages/dashboard/SettingsTeamPage";
import SettingsApiPage from "@/pages/dashboard/SettingsApiPage";
import SettingsNotificationsPage from "@/pages/dashboard/SettingsNotificationsPage";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public pages with header/footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/use-cases" element={<UseCasesPage />} />
                <Route path="/alternatives" element={<AlternativesPage />} />
                <Route path="/affiliates" element={<AffiliatesPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Route>

              {/* Auth pages (no layout chrome) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Dashboard pages with sidebar/header */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="agents" element={<AgentsPage />} />
                <Route path="agents/create" element={<AgentCreatePage />} />
                <Route path="agents/:id" element={<AgentDetailPage />} />
                <Route path="conversations" element={<ConversationsPage />} />
                <Route path="conversations/:id" element={<ConversationDetailPage />} />
                <Route path="contacts" element={<ContactsPage />} />
                <Route path="contacts/:id" element={<ContactDetailPage />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="campaigns/create" element={<CampaignCreatePage />} />
                <Route path="campaigns/:id" element={<CampaignDetailPage />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="channels" element={<ChannelsPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="tags" element={<TagsPage />} />
                <Route path="knowledge-base" element={<KnowledgeBasePage />} />
                <Route path="automations" element={<AutomationsPage />} />
                <Route path="lead-scoring" element={<LeadScoringPage />} />
                <Route path="white-label" element={<WhiteLabelPage />} />
                <Route path="activity-log" element={<ActivityLogPage />} />
                <Route path="settings/general" element={<SettingsGeneralPage />} />
                <Route path="settings/profile" element={<SettingsProfilePage />} />
                <Route path="settings/billing" element={<SettingsBillingPage />} />
                <Route path="settings/team" element={<SettingsTeamPage />} />
                <Route path="settings/api" element={<SettingsApiPage />} />
                <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
