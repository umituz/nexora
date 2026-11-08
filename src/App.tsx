import { BrowserRouter } from 'react-router'
import { SessionProvider } from '@umituz/web-auth/session'
import { I18nProvider } from '@umituz/web-localization/react'
import { ErrorBoundary } from '@umituz/web-design-system'
import '@umituz/web-auth/styles.css'
import { authAdapter } from '@/auth/adapter'
import { i18n } from '@/i18n'
import { AppRoutes } from '@/routes/AppRoutes'

function BootError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-lg font-semibold">Nexora AI could not start</h1>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Retry
      </button>
    </div>
  )
}

export default function App() {
  return (
    <I18nProvider i18n={i18n.instance}>
      <ErrorBoundary fallback={(_, reset) => <BootError onRetry={reset} />}>
        <SessionProvider adapter={authAdapter}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SessionProvider>
      </ErrorBoundary>
    </I18nProvider>
  )
}
