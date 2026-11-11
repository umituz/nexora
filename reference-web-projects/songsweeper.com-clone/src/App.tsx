import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { LibraryProvider } from "@/hooks/useLibrary";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import PrivacyPage from "./pages/PrivacyPage";
import SupportPage from "./pages/SupportPage";
import AboutPage from "./pages/AboutPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import DuplicatesPage from "./pages/dashboard/DuplicatesPage";
import SplitAlbumsPage from "./pages/dashboard/SplitAlbumsPage";
import LeastPlayedPage from "./pages/dashboard/LeastPlayedPage";
import MostPlayedPage from "./pages/dashboard/MostPlayedPage";
import DeletionQueuePage from "./pages/dashboard/DeletionQueuePage";
import LibraryPage from "./pages/dashboard/LibraryPage";
import AlbumsPage from "./pages/dashboard/AlbumsPage";
import AlbumDetailPage from "./pages/dashboard/AlbumDetailPage";
import ArtistsPage from "./pages/dashboard/ArtistsPage";
import ArtistDetailPage from "./pages/dashboard/ArtistDetailPage";
import PlaylistsPage from "./pages/dashboard/PlaylistsPage";
import PlaylistDetailPage from "./pages/dashboard/PlaylistDetailPage";
import GenresPage from "./pages/dashboard/GenresPage";
import GenreDetailPage from "./pages/dashboard/GenreDetailPage";
import FavoritesPage from "./pages/dashboard/FavoritesPage";
import RecentlyAddedPage from "./pages/dashboard/RecentlyAddedPage";
import RecentlyPlayedPage from "./pages/dashboard/RecentlyPlayedPage";
import SearchPage from "./pages/dashboard/SearchPage";
import StatisticsPage from "./pages/dashboard/StatisticsPage";
import HistoryPage from "./pages/dashboard/HistoryPage";
import ScanPage from "./pages/dashboard/ScanPage";
import ScanResultsPage from "./pages/dashboard/ScanResultsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import ExportPage from "./pages/dashboard/ExportPage";
import ImportPage from "./pages/dashboard/ImportPage";
import TagsPage from "./pages/dashboard/TagsPage";
import TagDetailPage from "./pages/dashboard/TagDetailPage";
import SongDetailPage from "./pages/dashboard/SongDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LibraryProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="duplicates" element={<DuplicatesPage />} />
              <Route path="split-albums" element={<SplitAlbumsPage />} />
              <Route path="least-played" element={<LeastPlayedPage />} />
              <Route path="most-played" element={<MostPlayedPage />} />
              <Route path="deletion-queue" element={<DeletionQueuePage />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="albums" element={<AlbumsPage />} />
              <Route path="albums/:id" element={<AlbumDetailPage />} />
              <Route path="artists" element={<ArtistsPage />} />
              <Route path="artists/:id" element={<ArtistDetailPage />} />
              <Route path="playlists" element={<PlaylistsPage />} />
              <Route path="playlists/:id" element={<PlaylistDetailPage />} />
              <Route path="genres" element={<GenresPage />} />
              <Route path="genres/:genre" element={<GenreDetailPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="recently-added" element={<RecentlyAddedPage />} />
              <Route path="recently-played" element={<RecentlyPlayedPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="scan" element={<ScanPage />} />
              <Route path="scan-results" element={<ScanResultsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="export" element={<ExportPage />} />
              <Route path="import" element={<ImportPage />} />
              <Route path="tags" element={<TagsPage />} />
              <Route path="tags/:tag" element={<TagDetailPage />} />
              <Route path="songs/:id" element={<SongDetailPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </LibraryProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
