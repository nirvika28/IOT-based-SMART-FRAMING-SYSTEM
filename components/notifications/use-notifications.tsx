"use client"
import { useNotifications as useNotificationsContext } from "./notification-provider"

export function useNotifications() {
  return useNotificationsContext()
}
