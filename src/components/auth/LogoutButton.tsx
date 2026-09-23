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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-red-200 transition-colors cursor-pointer ${className}`}
    >
      <svg
        className="w-3.5 h-3.5"
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
      Sign out
    </button>
  )
}
