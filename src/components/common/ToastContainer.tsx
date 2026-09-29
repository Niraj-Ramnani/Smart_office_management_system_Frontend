import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState, AppDispatch } from '../../store/store'
import { removeToast, type ToastItem } from '../../store/slices/toastSlice'

const AUTO_DISMISS_MS = 4500

const ToastCard: React.FC<{
  toast: ToastItem
  onDismiss: (id: string) => void
  onNavigate: (toast: ToastItem) => void
}> = ({ toast, onDismiss, onNavigate }) => {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 20)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      handleDismiss()
    }, AUTO_DISMISS_MS)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDismiss = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setExiting(true)
    window.setTimeout(() => onDismiss(toast.id), 260)
  }

  const handleClick = () => {
    handleDismiss()
    onNavigate(toast)
  }

  return (
    <div
      onClick={handleClick}
      title="Click to open Requests & Approvals"
      style={{
        transform: visible && !exiting ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
        opacity: visible && !exiting ? 1 : 0,
        transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease',
      }}
      className="pointer-events-auto relative w-full max-w-sm bg-zinc-950/95 backdrop-blur-md border border-orange-500/40 hover:border-orange-500 rounded-2xl shadow-2xl overflow-hidden cursor-pointer group transition-all"
      role="alert"
      aria-live="assertive"
    >

      <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 origin-left"
          style={{
            animation: `shrink ${AUTO_DISMISS_MS}ms linear forwards`,
          }}
        />
      </div>

      <div className="flex items-start gap-3.5 px-4 pt-4 pb-3.5">

        <div className="relative w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>

          <svg className="w-4.5 h-4.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-bold text-white leading-tight line-clamp-1 group-hover:text-orange-300 transition-colors">
              {toast.title}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleDismiss()
              }}
              className="text-zinc-500 hover:text-zinc-200 rounded-md p-0.5 transition-colors shrink-0 cursor-pointer"
              title="Dismiss"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-[12px] text-zinc-300 mt-1 leading-snug line-clamp-2">
            {toast.message}
          </p>

          <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-orange-400 group-hover:text-orange-300 transition-colors">
            <span className="flex items-center gap-1.5">
              <span>Open Requests & Approvals</span>
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <span className="text-[10px] text-zinc-500 font-normal">Click to open</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ToastContainer: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleDismiss = (id: string) => {
    dispatch(removeToast(id))
  }

  const handleNavigate = (toast: ToastItem) => {
    const destination = toast.link || '/seat-requests'
    navigate(destination)
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-5 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none w-full max-w-sm">
      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={handleDismiss}
          onNavigate={handleNavigate}
        />
      ))}
    </div>
  )
}

export default ToastContainer
