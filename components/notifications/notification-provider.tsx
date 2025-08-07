"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useRef } from "react"
import { toast } from "sonner"

export interface Notification {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  message: string
  timestamp: Date
  dismissed: boolean
  metric?: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "dismissed">) => void
  dismissNotification: (id: string) => void
  dismissAllNotifications: () => void
  checkThresholds: (farmData: any) => void
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

// Much more realistic thresholds - only critical alerts
const THRESHOLDS = {
  temperature: {
    critical: { min: 5, max: 40 }, // Only extreme temperatures
  },
  soilMoisture: {
    critical: { min: 10, max: 90 }, // Only when severely dry or waterlogged
  },
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const lastAlertTime = useRef<{ [key: string]: number }>({})

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "dismissed">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      dismissed: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Show toast notification with appropriate styling
    const toastOptions = {
      duration: notification.type === "critical" ? 8000 : 5000,
      position: "top-right" as const,
    }

    switch (notification.type) {
      case "critical":
        toast.error(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
        break
      case "warning":
        toast.warning(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
        break
      default:
        toast.info(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
    }
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, dismissed: true } : notification)),
    )
  }, [])

  const dismissAllNotifications = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, dismissed: true })))
  }, [])

  const checkThresholds = useCallback(
    (farmData: any) => {
      const now = Date.now()
      const THROTTLE_TIME = 300000 // 5 minutes to prevent spam

      // Only check for CRITICAL temperature issues
      const temp = farmData.temperature
      const tempAlertKey = `temperature_critical`

      if (!lastAlertTime.current[tempAlertKey] || now - lastAlertTime.current[tempAlertKey] > THROTTLE_TIME) {
        if (temp <= THRESHOLDS.temperature.critical.min || temp >= THRESHOLDS.temperature.critical.max) {
          lastAlertTime.current[tempAlertKey] = now
          addNotification({
            type: "critical",
            title: "🌡️ Extreme Temperature Alert",
            message: `Temperature is ${temp}°C - ${temp <= THRESHOLDS.temperature.critical.min ? "freezing conditions" : "heat stress"}. Immediate action required.`,
            metric: "temperature",
          })
        }
      }

      // Only check for CRITICAL soil moisture issues
      const soilMoisture = farmData.soilMoisture
      const soilAlertKey = `soilMoisture_critical`

      if (!lastAlertTime.current[soilAlertKey] || now - lastAlertTime.current[soilAlertKey] > THROTTLE_TIME) {
        if (
          soilMoisture <= THRESHOLDS.soilMoisture.critical.min ||
          soilMoisture >= THRESHOLDS.soilMoisture.critical.max
        ) {
          lastAlertTime.current[soilAlertKey] = now
          addNotification({
            type: "critical",
            title: "💧 Critical Soil Alert",
            message: `Soil moisture is ${soilMoisture}% - ${soilMoisture <= THRESHOLDS.soilMoisture.critical.min ? "severely dry" : "flooding risk"}. Urgent attention needed.`,
            metric: "soilMoisture",
          })
        }
      }

      // Remove all other threshold checks - no more spam!
    },
    [addNotification],
  )

  const value = {
    notifications,
    addNotification,
    dismissNotification,
    dismissAllNotifications,
    checkThresholds,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
