import { useState } from 'react'
import { Navigate, useLocation } from 'react-router'
import { AuthLayout, LoginForm, RegisterForm } from '@umituz/web-auth'
import type { User } from '@umituz/web-auth'
import { useSession } from '@umituz/web-auth/session'
import { betterAuthRegister } from '@umituz/web-auth/better-auth'
import { useAuthConfig } from '@/auth/config'
import { useT } from '@/i18n'

const linkButton =
  'text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80 disabled:opacity-50'

export default function LoginPage() {
  const location = useLocation()
  const [mode, setMode] = useState<'login' | 'register'>(() =>
    new URLSearchParams(location.search).get('mode') === 'register' ? 'register' : 'login',
  )
  const { user, login } = useSession()
  const t = useT()
  const authConfig = useAuthConfig()

  if (user) return <Navigate to="/app/chat" replace />

  const enterApp = () => {
    window.location.assign('/app/chat')
  }

  const handleLogin = async (credentials: { email: string; password: string }): Promise<User> => {
    const sessionUser = await login(credentials)
    return { id: sessionUser.id, email: sessionUser.email, name: sessionUser.name }
  }

  const handleRegister = async (data: { email: string; password: string; name?: string }): Promise<User> => {
    return betterAuthRegister(data)
  }

  return (
    <AuthLayout config={authConfig} translate={t}>
      {mode === 'login' ? (
        <LoginForm
          config={authConfig}
          showRememberMe={false}
          showSocialLogin={false}
          showRegisterLink={false}
          onLoginAttempt={handleLogin}
          onLoginSuccess={enterApp}
        />
      ) : (
        <RegisterForm
          config={authConfig}
          showSocialLogin={false}
          showLoginLink={false}
          onRegisterAttempt={handleRegister}
          onRegisterSuccess={enterApp}
        />
      )}

      <div className="mt-4 text-center text-sm">
        {mode === 'login' ? (
          <>
            <span className="text-muted-foreground">{t('auth.login.noAccount')} </span>
            <button type="button" className={linkButton} onClick={() => setMode('register')}>
              {t('auth.login.signUp')}
            </button>
          </>
        ) : (
          <>
            <span className="text-muted-foreground">{t('auth.register.haveAccount')} </span>
            <button type="button" className={linkButton} onClick={() => setMode('login')}>
              {t('auth.register.signIn')}
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
