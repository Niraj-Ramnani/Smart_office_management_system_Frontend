import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { playNotificationChime } from '../../utils/sound'

export interface ToastItem {
  id: string
  title: string
  message: string
  type?: string
  link?: string
  createdAt?: number
}

interface ToastState {
  toasts: ToastItem[]
}

const initialState: ToastState = {
  toasts: [],
}

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<ToastItem, 'id'>>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      const newToast: ToastItem = {
        ...action.payload,
        id,
        createdAt: Date.now(),
      }

      playNotificationChime()

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(action.payload.title, {
            body: action.payload.message,
            icon: '/favicon.svg',
          })
        } catch {

        }
      }

      state.toasts = [...state.toasts.slice(-3), newToast]
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    clearToasts: (state) => {
      state.toasts = []
    },
  },
})

export const { addToast, removeToast, clearToasts } = toastSlice.actions
export default toastSlice.reducer
