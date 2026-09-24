import { HTTP_STATUS } from '../constants/httpStatus'

export const extractErrorMessage = (err: unknown, fallback = 'An unexpected error occurred.'): string => {
  if (!err) return fallback
  if (typeof err === 'string') return err
  if (err instanceof Error) return err.message

  const apiError = err as {
    status?: number
    data?: {
      detail?: string | { error?: string; message?: string }
      message?: string
    }
  }

  const detail = apiError?.data?.detail
  if (typeof detail === 'string') return detail
  if (detail && typeof detail === 'object') {
    if (typeof detail.message === 'string') return detail.message
    if (typeof detail.error === 'string') return detail.error
  }

  if (typeof apiError?.data?.message === 'string') return apiError.data.message

  if (apiError?.status === HTTP_STATUS.FORBIDDEN) {
    return 'Your Microsoft account is not registered in the ITT DeskFlow system. Please contact your administrator.'
  }
  if (apiError?.status === HTTP_STATUS.UNAUTHORIZED) {
    return 'Authentication failed. Please verify your Microsoft login credentials.'
  }

  return fallback
}
