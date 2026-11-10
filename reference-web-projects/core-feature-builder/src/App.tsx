import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import BlitzMode from "./pages/BlitzMode";
import TrendingLibrary from "./pages/TrendingLibrary";
import ContentCreator from "./pages/ContentCreator";
import ContentCalendar from "./pages/ContentCalendar";
import Analytics from "./pages/Analytics";
import AvatarsLibrary from "./pages/AvatarsLibrary";
import VideoEditor from "./pages/VideoEditor";
import BrandKit from "./pages/BrandKit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blitz" element={<BlitzMode />} />
            <Route path="/trending" element={<TrendingLibrary />} />
            <Route path="/create" element={<ContentCreator />} />
            <Route path="/calendar" element={<ContentCalendar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/avatars" element={<AvatarsLibrary />} />
            <Route path="/editor" element={<VideoEditor />} />
            <Route path="/brand" element={<BrandKit />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
