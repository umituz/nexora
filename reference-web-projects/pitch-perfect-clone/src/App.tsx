import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import CampaignsPage from "./pages/dashboard/CampaignsPage";
import CampaignCreatePage from "./pages/dashboard/CampaignCreatePage";
import CampaignDetailPage from "./pages/dashboard/CampaignDetailPage";
import ContactsPage from "./pages/dashboard/ContactsPage";
import ContactDetailPage from "./pages/dashboard/ContactDetailPage";
import ContactsImportPage from "./pages/dashboard/ContactsImportPage";
import ConversationsPage from "./pages/dashboard/ConversationsPage";
import ConversationDetailPage from "./pages/dashboard/ConversationDetailPage";
import TemplatesPage from "./pages/dashboard/TemplatesPage";
import WorkflowsPage from "./pages/dashboard/WorkflowsPage";
import WorkflowBuilderPage from "./pages/dashboard/WorkflowBuilderPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import AiCopilotPage from "./pages/dashboard/AiCopilotPage";
import CreditsPage from "./pages/dashboard/CreditsPage";
import TagsPage from "./pages/dashboard/TagsPage";
import OptOutsPage from "./pages/dashboard/OptOutsPage";
import ScheduledPage from "./pages/dashboard/ScheduledPage";
import DripCampaignsPage from "./pages/dashboard/DripCampaignsPage";
import PhoneNumbersPage from "./pages/dashboard/PhoneNumbersPage";
import IntegrationsPage from "./pages/dashboard/IntegrationsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

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
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardOverview />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="campaigns/create" element={<CampaignCreatePage />} />
                <Route path="campaigns/:id" element={<CampaignDetailPage />} />
                <Route path="contacts" element={<ContactsPage />} />
                <Route path="contacts/import" element={<ContactsImportPage />} />
                <Route path="contacts/:id" element={<ContactDetailPage />} />
                <Route path="conversations" element={<ConversationsPage />} />
                <Route path="conversations/:id" element={<ConversationDetailPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="workflows" element={<WorkflowsPage />} />
                <Route path="workflows/builder" element={<WorkflowBuilderPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="ai-copilot" element={<AiCopilotPage />} />
                <Route path="credits" element={<CreditsPage />} />
                <Route path="tags" element={<TagsPage />} />
                <Route path="opt-outs" element={<OptOutsPage />} />
                <Route path="scheduled" element={<ScheduledPage />} />
                <Route path="drip-campaigns" element={<DripCampaignsPage />} />
                <Route path="phone-numbers" element={<PhoneNumbersPage />} />
                <Route path="integrations" element={<IntegrationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
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
