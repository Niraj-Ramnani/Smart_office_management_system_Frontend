import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { baseApi } from '../store/api/baseApi'
import type { AppDispatch } from '../store/store'

export const useNotificationWebSocket = (userId?: number | null) => {
  const dispatch = useDispatch<AppDispatch>()
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!userId) return

    const getWsUrl = () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
      const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws'
      const cleanHost = apiUrl.replace(/^https?:\/\//, '')
      return `${wsProtocol}://${cleanHost}/ws/notifications?user_id=${userId}`
    }

    const connect = () => {
      try {
        const url = getWsUrl()
        const ws = new WebSocket(url)
        socketRef.current = ws

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'NOTIFICATION' || data.type === 'REFRESH') {
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
          } catch (err) {
            console.error('Error parsing notification socket message', err)
          }
        }

        ws.onclose = () => {
          if (reconnectTimeoutRef.current) {
            window.clearTimeout(reconnectTimeoutRef.current)
          }
          reconnectTimeoutRef.current = window.setTimeout(() => {
            connect()
          }, 3000)
        }

        ws.onerror = () => {
          ws.close()
        }
      } catch (err) {
        console.error('Failed to establish notification socket connection', err)
      }
    }

    connect()

    return () => {
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
