import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} from '../../store/api/notificationApi'
import type { NotificationItem } from '../../types'

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { data } = useGetNotificationsQuery(undefined, {
    pollingInterval: 10000,
  })
  const [markRead] = useMarkNotificationReadMutation()
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation()
  const [deleteNotification] = useDeleteNotificationMutation()

  const notifications = data?.notifications || []
  const unreadCount = data?.unread_count || 0

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.is_read) {
      await markRead(item.id)
    }
    setIsOpen(false)

    if (
      item.reference_type === 'SEAT_REQUEST' ||
      item.notification_type === 'REQUEST' ||
      item.notification_type === 'APPROVAL' ||
      item.notification_type === 'SWAP_CONSENT' ||
      item.title.toLowerCase().includes('request') ||
      item.title.toLowerCase().includes('approval') ||
      item.title.toLowerCase().includes('seat')
    ) {
      navigate('/seat-requests')
    } else if (item.reference_type === 'ASSET' || item.notification_type === 'ASSET') {
      navigate('/seat-requests')
    } else {
      navigate('/seat-requests')
    }
  }

  const handleMarkAll = async () => {
    if (notifications.length > 0) {
      try {
        await markAllRead().unwrap()
      } catch (err) {
        console.error('Failed to clear notifications', err)
      }
    }
  }

  const handleDeleteItem = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    try {
      await deleteNotification(id).unwrap()
    } catch (err) {
      console.error('Failed to delete notification', err)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-colors focus:outline-none cursor-pointer ${
          unreadCount > 0
            ? 'text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 hover:text-orange-300'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >

        {unreadCount > 0 && (
          <span className="absolute inset-0 rounded-xl border border-red-500/50 animate-ping opacity-60 pointer-events-none" />
        )}

        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full shadow-md ring-1 ring-zinc-950">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[13px] text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="flex items-center gap-1 bg-red-100 text-red-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAll}
                  disabled={isMarkingAll}
                  className="text-[11px] font-medium text-slate-600 hover:text-orange-600 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isMarkingAll ? 'Clearing...' : 'Mark all read'}
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 card-scroll divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-50 flex items-start space-x-3 group relative ${
                    !n.is_read ? 'bg-orange-50/30 border-l-2 border-red-500' : ''
                  }`}
                >
                  <div className="mt-1 shrink-0">
                    {!n.is_read ? (
                      <span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 block" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <p className={`text-xs ${!n.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[10px] text-slate-400">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(n.created_at).toLocaleDateString()}
                      </p>
                      <span className="text-[10px] font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        View request &rarr;
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteItem(e, n.id)}
                    title="Dismiss notification"
                    className="absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-opacity cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                navigate('/seat-requests')
              }}
              className="w-full text-center text-xs font-semibold text-orange-600 hover:text-orange-700 py-1 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Go to Requests & Approvals</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
