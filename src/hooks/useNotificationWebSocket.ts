import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { baseApi } from '../store/api/baseApi'
import type { AppDispatch } from '../store/store'
import { addToast } from '../store/slices/toastSlice'

export const useNotificationWebSocket = (userId?: number | null) => {
  const dispatch = useDispatch<AppDispatch>()
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const heartbeatIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    const getWsUrl = () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
      const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws'
      const cleanHost = apiUrl.replace(/^https?:\/\
      const queryParam = userId ? `?user_id=${userId}` : ''
      return `${wsProtocol}://${cleanHost}/ws/notifications${queryParam}`
    }

    const connect = () => {

      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }

      if (socketRef.current) {
        try {
          socketRef.current.close()
        } catch {

        }
        socketRef.current = null
      }

      try {
        const url = getWsUrl()
        const ws = new WebSocket(url)
        socketRef.current = ws

        ws.onopen = () => {

          if (heartbeatIntervalRef.current) {
            window.clearInterval(heartbeatIntervalRef.current)
          }
          heartbeatIntervalRef.current = window.setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send('ping')
            }
          }, 20000)

          dispatch(
            baseApi.util.invalidateTags([
              'Notification',
              'SeatRequest',
              'Seat',
              'Asset',
              'Employee',
            ])
          )
        }

        ws.onmessage = (event) => {
          try {
            if (event.data === 'pong') return

            const data = JSON.parse(event.data)

            if (data.tags && Array.isArray(data.tags)) {
              dispatch(baseApi.util.invalidateTags(data.tags))
            } else {
              dispatch(
                baseApi.util.invalidateTags([
                  'Notification',
                  'SeatRequest',
                  'Seat',
                  'Asset',
                  'Employee',
                  'Team',
                  'Building',
                  'Floor',
                ])
              )
            }

            if (
              (data.event === 'NOTIFICATION' || data.type === 'NOTIFICATION') &&
              data.title &&
              data.message
            ) {
              dispatch(
                addToast({
                  title: data.title,
                  message: data.message,
                  type: data.notification_type || data.type,
                  link: '/seat-requests',
                })
              )
            }
          } catch (err) {
            console.error('Error parsing notification socket message', err)
          }
        }

        ws.onclose = () => {
          if (heartbeatIntervalRef.current) {
            window.clearInterval(heartbeatIntervalRef.current)
            heartbeatIntervalRef.current = null
          }
          if (!reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = window.setTimeout(() => {
              reconnectTimeoutRef.current = null
              connect()
            }, 2500)
          }
        }

        ws.onerror = () => {
          try {
            ws.close()
          } catch {

          }
        }
      } catch (err) {
        console.error('Failed to establish notification socket connection', err)
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectTimeoutRef.current = null
            connect()
          }, 3000)
        }
      }
    }

    connect()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
          connect()
        } else {

          dispatch(
            baseApi.util.invalidateTags([
              'Notification',
              'SeatRequest',
              'Seat',
              'Asset',
              'Employee',
            ])
          )
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (heartbeatIntervalRef.current) {
        window.clearInterval(heartbeatIntervalRef.current)
      }
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current)
      }
      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = null
      }
    }
  }, [userId, dispatch])
}
