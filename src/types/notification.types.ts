export type NotificationType =
  | 'REQUEST'
  | 'APPROVAL'
  | 'EXECUTION'
  | 'SWAP_CONSENT'
  | 'ASSET'

export interface NotificationItem {
  id: number
  user_id: number
  title: string
  message: string
  notification_type: NotificationType
  is_read: boolean
  reference_id: number | null
  reference_type: string | null
  created_at: string
}

export interface NotificationSummary {
  notifications: NotificationItem[]
  unread_count: number
}
