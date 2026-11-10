import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PublicLayout } from "@/layouts/PublicLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Docs from "./pages/Docs";
import Changelog from "./pages/Changelog";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import DashboardOverview from "./pages/dashboard/Overview";
import Bots from "./pages/dashboard/Bots";
import BotDetail from "./pages/dashboard/BotDetail";
import Deployments from "./pages/dashboard/Deployments";
import Channels from "./pages/dashboard/Channels";
import Models from "./pages/dashboard/Models";
import Analytics from "./pages/dashboard/Analytics";
import Logs from "./pages/dashboard/Logs";
import ApiKeys from "./pages/dashboard/ApiKeys";
import Webhooks from "./pages/dashboard/Webhooks";
import Team from "./pages/dashboard/Team";
import Settings from "./pages/dashboard/Settings";
import Profile from "./pages/dashboard/Profile";
import Billing from "./pages/dashboard/Billing";
import Usage from "./pages/dashboard/Usage";
import Notifications from "./pages/dashboard/Notifications";
import Conversations from "./pages/dashboard/Conversations";
import Templates from "./pages/dashboard/Templates";
import KnowledgeBase from "./pages/dashboard/KnowledgeBase";
import ScheduledTasks from "./pages/dashboard/ScheduledTasks";
import Integrations from "./pages/dashboard/Integrations";
import AuditLog from "./pages/dashboard/AuditLog";
import Support from "./pages/dashboard/Support";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/careers" element={<Careers />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardOverview />} />
        <Route path="bots" element={<Bots />} />
        <Route path="bots/:id" element={<BotDetail />} />
        <Route path="deployments" element={<Deployments />} />
        <Route path="channels" element={<Channels />} />
        <Route path="models" element={<Models />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="logs" element={<Logs />} />
        <Route path="api-keys" element={<ApiKeys />} />
        <Route path="webhooks" element={<Webhooks />} />
        <Route path="team" element={<Team />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="billing" element={<Billing />} />
        <Route path="usage" element={<Usage />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="conversations" element={<Conversations />} />
        <Route path="templates" element={<Templates />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="scheduled-tasks" element={<ScheduledTasks />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="audit-log" element={<AuditLog />} />
        <Route path="support" element={<Support />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
