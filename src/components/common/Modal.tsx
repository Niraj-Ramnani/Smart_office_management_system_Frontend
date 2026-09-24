import React from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = 'md',
  children,
}) => {
  if (!isOpen) return null

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-slate-100 ${maxWidthClass} w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
          >
            
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
