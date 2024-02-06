import { createContext, useContext } from 'react'
import { NotificationsAction } from '../reducers'
import { Notification } from '../types'

interface NotificationsContext {
  notifications: Notification[]
  createNotification: (data: NotificationsAction['payload']['data']) => void
  deleteNotification: (notificationId: string) => void
}

export const NotificationsContext = createContext<NotificationsContext | undefined>(undefined)

export function useNotifications() {
  return useContext(NotificationsContext) as NotificationsContext
}