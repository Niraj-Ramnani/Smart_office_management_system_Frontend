import React, { useState, useRef, useEffect } from 'react'

export interface ActionMenuItem {
  label: string
  onClick: () => void
  isDestructive?: boolean
  disabled?: boolean
}

export interface ActionMenuProps {
  primaryAction?: {
    label: string
    onClick: () => void
    disabled?: boolean
  }
  items: ActionMenuItem[]
  align?: 'left' | 'right'
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  primaryAction,
  items,
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const standardItems = items.filter((item) => !item.isDestructive)
  const destructiveItems = items.filter((item) => item.isDestructive)

  return (
    <div
      className="inline-flex items-center gap-1.5 relative text-left"
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
    >
      {primaryAction && (
        <button
          type="button"
          onClick={primaryAction.onClick}
          disabled={primaryAction.disabled}
          className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors cursor-pointer disabled:opacity-50"
        >
          {primaryAction.label}
        </button>
      )}

      {items.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Actions"
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 bg-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {isOpen && (
            <div
              className={`absolute top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200/90 py-1 z-30 animate-in fade-in duration-100 ${
                align === 'right' ? 'right-0' : 'left-0'
              }`}
            >
              {standardItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    setIsOpen(false)
                    item.onClick()
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}

              {destructiveItems.length > 0 && standardItems.length > 0 && (
                <div className="my-1 border-t border-slate-100" />
              )}

              {destructiveItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    setIsOpen(false)
                    item.onClick()
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50 font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
