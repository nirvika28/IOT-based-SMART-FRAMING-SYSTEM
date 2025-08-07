"use client"

import { useState, useEffect, useCallback } from "react"

export interface FarmData {
  temperature: number
  humidity: number
  soilMoisture: number
  lightIntensity: number
  lastIrrigationTime: string
  autoIrrigation: boolean
  irrigationCount: number
  healthStatus?: string
  crop: string
  growthStage: string
  diseaseRisk: string
  ndvi: number
  chlorophyllIndex: number
  animals: Array<{
    id: string
    location: string
    status: string
  }>
}

export function useFarmData() {
  console.log("🎣 useFarmData hook called at:", new Date().toISOString())
  
  const [farmData, setFarmData] = useState<FarmData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false)

  // Fallback to local JSON data
  const fetchLocalData = useCallback(async () => {
    console.log("📁 fetchLocalData called")
    try {
      const response = await fetch("/data.json")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      console.log("✅ Local data loaded successfully:", data)
      return data
    } catch (err) {
      console.error("❌ Error fetching local data:", err)
      throw err
    }
  }, [])

  // Firebase setup function
  const setupFirebaseConnection = useCallback(async () => {
    console.log("🔥 setupFirebaseConnection called")
    
    try {
      // Dynamic import to ensure client-side only
      const { database } = await import("@/lib/firebase")
      const { ref, onValue } = await import("firebase/database")
      
      console.log("🔥 Firebase modules imported, database:", !!database)
      
      if (!database) {
        console.warn("⚠️ Firebase database not available")
        throw new Error("Firebase database not initialized")
      }

      console.log("📡 Creating Firebase reference...")
      const dataRef = ref(database, 'farm/data')
      console.log("📡 Reference created for path: farm/data")
      
      return new Promise((resolve, reject) => {
        console.log("📡 Setting up onValue listener...")
        
        const unsubscribe = onValue(
          dataRef,
          (snapshot) => {
            console.log("📨 Firebase snapshot received!")
            console.log("📨 Snapshot exists:", snapshot.exists())
            
            if (snapshot.exists()) {
              const data = snapshot.val()
              console.log("✅ Firebase data found:", data)
              
              const processedData = {
                ...data,
                healthStatus: data.healthStatus || "Moderate"
              }
              
              setFarmData(processedData)
              setIsFirebaseConnected(true)
              setError(null)
              setLoading(false)
              console.log("✅ Firebase connection successful!")
              resolve(unsubscribe)
            } else {
              console.log("⚠️ No data at Firebase path")
              reject(new Error("No data found in Firebase"))
            }
          },
          (firebaseError) => {
            console.error("❌ Firebase error:", firebaseError)
            reject(firebaseError)
          }
        )
      })
    } catch (error) {
      console.error("❌ Firebase setup failed:", error)
      throw error
    }
  }, [])

  // Initialize data
  const initializeData = useCallback(async () => {
    console.log("🚀 initializeData called")
    setLoading(true)
    setError(null)

    try {
      // Try Firebase first
      console.log("🔥 Attempting Firebase connection...")
      await setupFirebaseConnection()
      console.log("✅ Firebase connection successful")
    } catch (firebaseError) {
      console.log("⚠️ Firebase failed, trying local data...")
      console.error("Firebase error:", firebaseError)
      
      try {
        const localData = await fetchLocalData()
        setFarmData(localData)
        setIsFirebaseConnected(false)
        setError(null)
        setLoading(false)
        console.log("✅ Local data loaded successfully")
      } catch (localError) {
        console.error("❌ Local data also failed:", localError)
        setError("Failed to load any data")
        setLoading(false)
      }
    }
  }, [setupFirebaseConnection, fetchLocalData])

  const updateDashboard = useCallback((newData: Partial<FarmData>) => {
    console.log("🔄 updateDashboard called with:", newData)
    
    if (isFirebaseConnected) {
      console.log("📤 Would update Firebase (not implemented in this version)")
    }
    
    // Always update local state
    setFarmData((prevData) => {
      if (!prevData) return null
      return { ...prevData, ...newData }
    })
  }, [isFirebaseConnected])

  // Main useEffect
  useEffect(() => {
    console.log("🚀 useEffect triggered at:", new Date().toISOString())
    
    let mounted = true
    
    const init = async () => {
      if (mounted) {
        await initializeData()
      }
    }
    
    init()
    
    return () => {
      console.log("🧹 Cleanup - component unmounting")
      mounted = false
    }
  }, [initializeData])

  console.log("🎣 useFarmData returning state:", { 
    farmData: !!farmData, 
    loading, 
    error, 
    isFirebaseConnected 
  })

  return {
    farmData,
    loading,
    error,
    updateDashboard,
    refetch: initializeData,
    isFirebaseConnected,
  }
}
