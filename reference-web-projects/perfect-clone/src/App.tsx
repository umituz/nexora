import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Trials from "./pages/Trials";
import Conversions from "./pages/Conversions";
import Funnel from "./pages/Funnel";
import SmartCharge from "./pages/SmartCharge";
import Customers from "./pages/Customers";
import Segments from "./pages/Segments";
import BlockedUsers from "./pages/BlockedUsers";
import Transactions from "./pages/Transactions";
import Chargebacks from "./pages/Chargebacks";
import Revenue from "./pages/Revenue";
import Invoices from "./pages/Invoices";
import AIInsights from "./pages/AIInsights";
import Experiments from "./pages/Experiments";
import Recommendations from "./pages/Recommendations";
import CheckoutPages from "./pages/CheckoutPages";
import Channels from "./pages/Channels";
import Events from "./pages/Events";
import Campaigns from "./pages/Campaigns";
import Integrations from "./pages/Integrations";
import Webhooks from "./pages/Webhooks";
import ApiKeys from "./pages/ApiKeys";
import SettingsPage from "./pages/Settings";
import Team from "./pages/Team";
import Billing from "./pages/Billing";
import NotificationsSettings from "./pages/NotificationsSettings";
import AuditLog from "./pages/AuditLog";
import DiscountCodes from "./pages/DiscountCodes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected dashboard routes */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/trials" element={<Trials />} />
              <Route path="/conversions" element={<Conversions />} />
              <Route path="/funnel" element={<Funnel />} />
              <Route path="/smart-charge" element={<SmartCharge />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/segments" element={<Segments />} />
              <Route path="/blocked-users" element={<BlockedUsers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/chargebacks" element={<Chargebacks />} />
              <Route path="/revenue" element={<Revenue />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/experiments" element={<Experiments />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/checkout-pages" element={<CheckoutPages />} />
              <Route path="/channels" element={<Channels />} />
              <Route path="/events" element={<Events />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/webhooks" element={<Webhooks />} />
              <Route path="/api-keys" element={<ApiKeys />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/team" element={<Team />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/notifications-settings" element={<NotificationsSettings />} />
              <Route path="/audit-log" element={<AuditLog />} />
              <Route path="/discount-codes" element={<DiscountCodes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
