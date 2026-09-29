import React from 'react'

export interface NotificationBannerProps {
  successMessage?: string | null
  errorMessage?: string | null
  onClearSuccess?: () => void
  onClearError?: () => void
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  successMessage,
  errorMessage,
  onClearSuccess,
  onClearError,
}) => {
  if (!successMessage && !errorMessage) return null

  return (
    <div className="space-y-3">
      {successMessage && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800 flex justify-between items-center">
          <span>{successMessage}</span>
          {onClearSuccess && (
            <button
              type="button"
              onClick={onClearSuccess}
              className="text-green-600 hover:text-green-800 font-bold ml-2 cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 flex justify-between items-center">
          <span>{errorMessage}</span>
          {onClearError && (
            <button
              type="button"
              onClick={onClearError}
              className="text-red-600 hover:text-red-800 font-bold ml-2 cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  )
}
