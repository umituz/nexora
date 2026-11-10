import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ModelsPage from "./pages/ModelsPage";
import ModelDetailPage from "./pages/ModelDetailPage";
import IdeasPage from "./pages/IdeasPage";
import UseCasesPage from "./pages/UseCasesPage";
import UseCaseDetailPage from "./pages/UseCaseDetailPage";
import PricingPage from "./pages/PricingPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ThreadsPage from "./pages/ThreadsPage";
import ThreadDetailPage from "./pages/ThreadDetailPage";
import MediaDetailPage from "./pages/MediaDetailPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProductPage from "./pages/ProductPage";
import ResourcesPage from "./pages/ResourcesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import { AboutPage, BlogPage, CareersPage, ContactPage, PrivacyPage, TermsPage, CookiesPage, TutorialsPage, ShowcasePage, ApiDocsPage, ChangelogPage } from "./pages/StaticPages";
import GeneratePage from "./pages/dashboard/GeneratePage";
import CreationsPage from "./pages/dashboard/CreationsPage";
import CollectionsPage from "./pages/dashboard/CollectionsPage";
import FavoritesPage from "./pages/dashboard/FavoritesPage";
import HistoryPage from "./pages/dashboard/HistoryPage";
import DashboardModelsPage from "./pages/dashboard/DashboardModelsPage";
import TemplatesPage from "./pages/dashboard/TemplatesPage";
import CommunityPage from "./pages/dashboard/CommunityPage";
import DashboardThreadsPage from "./pages/dashboard/DashboardThreadsPage";
import ApiKeysPage from "./pages/dashboard/ApiKeysPage";
import CreditsPage from "./pages/dashboard/CreditsPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/models" element={<ModelsPage />} />
            <Route path="/models/:modelId" element={<ModelDetailPage />} />
            <Route path="/ideas" element={<IdeasPage />} />
            <Route path="/use-cases" element={<UseCasesPage />} />
            <Route path="/use-cases/:slug" element={<UseCaseDetailPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/threads" element={<ThreadsPage />} />
            <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
            <Route path="/media/:mediaId" element={<MediaDetailPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/tutorials" element={<TutorialsPage />} />
            <Route path="/showcase" element={<ShowcasePage />} />
            <Route path="/api-docs" element={<ApiDocsPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
          </Route>

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="generate" element={<GeneratePage />} />
            <Route path="creations" element={<CreationsPage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="models" element={<DashboardModelsPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="threads" element={<DashboardThreadsPage />} />
            <Route path="api-keys" element={<ApiKeysPage />} />
            <Route path="credits" element={<CreditsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
