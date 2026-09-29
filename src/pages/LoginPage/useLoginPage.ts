import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { useDispatch, useSelector } from 'react-redux'
import { loginWithMicrosoft, logoutMicrosoft } from '../../services/authService'
import { useLazyGetMeQuery } from '../../store/api/baseApi'
import { setAuthUser, setAuthError, clearAuth } from '../../store/slices/authSlice'
import { extractErrorMessage } from '../../utils/authErrors'
import type { RootState } from '../../store/store'

export const useLoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const isMsalAuthenticated = useIsAuthenticated()
  const { inProgress } = useMsal()
  const authState = useSelector((state: RootState) => state.auth)

  const [triggerGetMe, { isLoading: isFetchingMe }] = useLazyGetMeQuery()
  const [localError, setLocalError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const fromPath = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'

  useEffect(() => {
    if (isMsalAuthenticated && inProgress === 'none') {
      const fetchUserProfile = async () => {
        try {
          const result = await triggerGetMe().unwrap()
          dispatch(setAuthUser(result))
          setLocalError(null)
          navigate(fromPath, { replace: true })
        } catch (err: unknown) {
          const errorMessage = extractErrorMessage(err, 'Failed to verify account with the server.')
          setLocalError(errorMessage)
          dispatch(setAuthError(errorMessage))
        }
      }

      fetchUserProfile()
    }
  }, [isMsalAuthenticated, inProgress, triggerGetMe, dispatch, navigate, fromPath])

  const handleLogin = async () => {
    setLocalError(null)
    setIsSigningIn(true)
    try {
      await loginWithMicrosoft(false)
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, 'An error occurred during Microsoft sign-in')
      setLocalError(msg)
      dispatch(setAuthError(msg))
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleResetSession = async () => {
    dispatch(clearAuth())
    setLocalError(null)
    sessionStorage.clear()
    localStorage.clear()
    await logoutMicrosoft()
  }

  const isLoading = isSigningIn || isFetchingMe || inProgress !== 'none'
  const rawError = localError || authState.error
  const displayError = typeof rawError === 'string' ? rawError : rawError ? String(rawError) : null

  return {
    isLoading,
    displayError,
    isMsalAuthenticated,
    handleLogin,
    handleResetSession,
  }
}
