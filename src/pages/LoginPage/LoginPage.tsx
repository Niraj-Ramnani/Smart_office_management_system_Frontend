import { LoginButton } from '../../components/auth/LoginButton'
import { useLoginPage } from './useLoginPage'
import logo from '../../assets/logo.png'

export const LoginPage = () => {
  const {
    isLoading,
    displayError,
    isMsalAuthenticated,
    handleLogin,
    handleResetSession,
  } = useLoginPage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center space-y-2">
          <img src={logo} alt="ITT DeskFlow Logo" className="h-16 w-auto mx-auto object-contain mb-2" />

          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Smart seating allocation and workplace resource scheduling. Sign in with your corporate account to continue.
          </p>
        </div>

        {displayError && (
          <div
            id="auth-error-banner"
            className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 space-y-2"
          >
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1 font-medium">{displayError}</div>
            </div>
            {isMsalAuthenticated && (
              <div className="pt-2 border-t border-red-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleResetSession}
                  className="text-xs font-semibold text-red-700 hover:text-red-900 underline cursor-pointer"
                >
                  Switch / Sign out account
                </button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 pt-2">
          <LoginButton
            onLogin={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
          />

          <div className="text-center">
            <span className="text-xs text-slate-400">
              Secured by Microsoft Entra ID Single Sign-On
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
