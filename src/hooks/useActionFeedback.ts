import { useState } from 'react'
import { extractErrorMessage } from '../utils/authErrors'

export function useActionFeedback() {
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const clearFeedback = () => {
    setActionError(null)
    setActionSuccess(null)
  }

  const notifySuccess = (message: string) => {
    setActionError(null)
    setActionSuccess(message)
  }

  const notifyError = (error: unknown, fallbackMessage?: string) => {
    setActionSuccess(null)
    setActionError(extractErrorMessage(error, fallbackMessage))
  }

  return {
    actionError,
    actionSuccess,
    setActionError,
    setActionSuccess,
    clearFeedback,
    notifySuccess,
    notifyError,
  }
}
