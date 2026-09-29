import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { useDispatch, useSelector } from 'react-redux'
import { useLazyGetMeQuery } from '../store/api/baseApi'
import { setAuthUser, setAuthError } from '../store/slices/authSlice'
import { extractErrorMessage } from '../utils/authErrors'
import type { RootState } from '../store/store'

interface ProtectedRouteProps {
  requiredRole?: string
  allowedRoles?: string[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  allowedRoles,
}) => {
  const isMsalAuthenticated = useIsAuthenticated()
  const { inProgress } = useMsal()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user, error } = useSelector((state: RootState) => state.auth)
  const [triggerGetMe, { isLoading: isFetchingMe }] = useLazyGetMeQuery()

  useEffect(() => {
    if (isMsalAuthenticated && !user && !error && inProgress === 'none') {
      triggerGetMe()
        .unwrap()
        .then((profile) => {
          dispatch(setAuthUser(profile))
        })
        .catch((err: unknown) => {
          dispatch(setAuthError(extractErrorMessage(err, 'Failed to authenticate with backend.')))
        })
    }
  }, [isMsalAuthenticated, user, error, inProgress, triggerGetMe, dispatch])

  if (!isMsalAuthenticated && inProgress === 'none') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (inProgress !== 'none' || (isMsalAuthenticated && !user && !error) || isFetchingMe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <svg
          className="animate-spin h-8 w-8 text-orange-600"
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
        <p className="text-sm font-medium text-slate-600">Verifying authentication...</p>
      </div>
    )
  }

  if (error) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user) {
    if (requiredRole && user.role !== requiredRole) {
      return (
        <div className="p-8 text-center space-y-3">
          <h2 className="text-xl font-bold text-red-600">Access Restricted</h2>
          <p className="text-sm text-slate-600">
            You need the <span className="font-semibold">{requiredRole}</span> role to access this section.
          </p>
        </div>
      )
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return (
        <div className="p-8 text-center space-y-3">
          <h2 className="text-xl font-bold text-red-600">Access Restricted</h2>
          <p className="text-sm text-slate-600">
            Your role (<span className="font-semibold">{user.role}</span>) does not have access to this section.
          </p>
        </div>
      )
    }
  }

  return <Outlet />
}
