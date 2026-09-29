import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

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
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const menuWidth = 160
    const approxHeight = items.length * 36 + 16

    let top = rect.bottom + 4
    if (rect.bottom + approxHeight > window.innerHeight && rect.top - approxHeight > 0) {
      top = rect.top - approxHeight - 4
    }

    let left = align === 'right' ? rect.right - menuWidth : rect.left
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8
    }
    if (left < 8) {
      left = 8
    }

    setCoords({ top, left })
  }, [items.length, align])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isOpen) {
      updatePosition()
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    const handleScrollOrResize = () => {
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [isOpen])

  const standardItems = items.filter((item) => !item.isDestructive)
  const destructiveItems = items.filter((item) => item.isDestructive)

  return (
    <div
      className="inline-flex items-center gap-1.5 relative text-left"
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
            ref={buttonRef}
            type="button"
            onClick={handleToggle}
            aria-label="Actions"
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 bg-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {isOpen &&
            coords &&
            createPortal(
              <div
                ref={dropdownRef}
                style={{
                  position: 'fixed',
                  top: `${coords.top}px`,
                  left: `${coords.left}px`,
                  zIndex: 99999,
                }}
                className="w-40 bg-white rounded-lg shadow-xl border border-slate-200/95 py-1 animate-in fade-in duration-100"
                onClick={(e) => e.stopPropagation()}
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
              </div>,
              document.body
            )}
        </div>
      )}
    </div>
  )
}

export default ActionMenu
