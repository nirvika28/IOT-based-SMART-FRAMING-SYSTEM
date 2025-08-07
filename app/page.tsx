"use client"

import { NotificationProvider } from "@/components/notifications/notification-provider"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function SmartFarmingDashboard() {
  console.log("🏠 Rendering main page...")
  console.log("🔍 Check browser console for Firebase connection logs")
  
  return (
    <NotificationProvider>
      <DashboardContent />
    </NotificationProvider>
  )
}
