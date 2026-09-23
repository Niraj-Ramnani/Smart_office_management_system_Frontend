import React from 'react'

interface LoginButtonProps {
  onLogin: () => void
  isLoading?: boolean
  disabled?: boolean
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  onLogin,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      id="btn-ms-login"
      onClick={onLogin}
      disabled={disabled || isLoading}
      className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 23 23"
        >
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
      )}
      <span>{isLoading ? 'Signing in with Microsoft...' : 'Sign in with Microsoft'}</span>
    </button>
  )
}
