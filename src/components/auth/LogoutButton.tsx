import React from 'react'
import { useDispatch } from 'react-redux'
import { logoutMicrosoft } from '../../services/authService'
import { clearAuth } from '../../store/slices/authSlice'

interface LogoutButtonProps {
  className?: string
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ className = '' }) => {
  const dispatch = useDispatch()

  const handleLogout = async () => {
    dispatch(clearAuth())
    await logoutMicrosoft()
  }

  return (
    <button
      type="button"
      id="btn-ms-logout"
      onClick={handleLogout}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-red-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-red-500/40 rounded-lg transition-all duration-150 cursor-pointer shadow-xs group ${className}`}
      title="Sign out of your account"
    >
      <svg
        className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>Sign out</span>
    </button>
  )
}
