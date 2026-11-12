import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import AppLayout from '@/app/AppLayout'
import LandingHomePage from '@/landing/LandingHomePage'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const ChatPage = lazy(() => import('@/pages/ChatPage'))
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'))
const MemoriesPage = lazy(() => import('@/pages/MemoriesPage'))
const AgentsPage = lazy(() => import('@/pages/AgentsPage'))
const KnowledgePage = lazy(() => import('@/pages/KnowledgePage'))
const ResearchPage = lazy(() => import('@/pages/ResearchPage'))
const CodePage = lazy(() => import('@/pages/CodePage'))
const StudioPage = lazy(() => import('@/pages/StudioPage'))
const ModelsPage = lazy(() => import('@/pages/ModelsPage'))
const UsagePage = lazy(() => import('@/pages/UsagePage'))
const FeaturesPage = lazy(() => import('@/landing/FeaturesPage'))

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
    </div>
  )
}

export function AppRoutes(): ReactNode {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<LandingHomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:conversationId" element={<ChatPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="memories" element={<MemoriesPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="code" element={<CodePage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="models" element={<ModelsPage />} />
          <Route path="usage" element={<UsagePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
