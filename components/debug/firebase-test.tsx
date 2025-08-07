"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FirebaseTest() {
  const [testResults, setTestResults] = useState<string[]>([])

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testFirebaseConnection = async () => {
    setTestResults([])
    addLog("🔥 Starting Firebase connection test...")

    try {
      // Test Firebase initialization
      addLog("📦 Importing Firebase modules...")
      const { initializeApp } = await import('firebase/app')
      const { getDatabase, ref, get } = await import('firebase/database')
      
      addLog("✅ Firebase modules imported successfully")

      // Initialize Firebase with Singapore region URL
      const firebaseConfig = {
        apiKey: "AIzaSyAYvwdH3kniCQrof4LLQyxo6PFyjoP7wJo",
        authDomain: "sma-farm.firebaseapp.com",
        databaseURL: "https://sma-farm-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "sma-farm",
        storageBucket: "sma-farm.firebasestorage.app",
        messagingSenderId: "199944668835",
        appId: "1:199944668835:web:b1cfa20e18de1d8f94e116",
        measurementId: "G-993X07QW37"
      }

      addLog("🔥 Initializing Firebase app (Singapore region)...")
      const app = initializeApp(firebaseConfig, 'debug-app')
      addLog("✅ Firebase app initialized")

      addLog("🔥 Getting database instance...")
      const database = getDatabase(app)
      addLog(`✅ Database instance created: ${database.app.options.databaseURL}`)

      // Test reading data
      addLog("📡 Testing data read from farm/data...")
      const dataRef = ref(database, 'farm/data')
      
      const snapshot = await get(dataRef)
      
      if (snapshot.exists()) {
        const data = snapshot.val()
        addLog("✅ Data found in Firebase!")
        addLog(`📊 Data keys: ${Object.keys(data).join(', ')}`)
        addLog(`🌡️ Temperature: ${data.temperature}`)
        addLog(`💧 Humidity: ${data.humidity}`)
        addLog(`🌱 Crop: ${data.crop}`)
        addLog(`🚿 Auto Irrigation: ${data.autoIrrigation}`)
      } else {
        addLog("⚠️ No data found at farm/data path")
        
        // Test if there's any data at root
        const rootRef = ref(database, '/')
        const rootSnapshot = await get(rootRef)
        
        if (rootSnapshot.exists()) {
          const rootData = rootSnapshot.val()
          addLog(`📁 Root data keys: ${Object.keys(rootData).join(', ')}`)
        } else {
          addLog("❌ No data found at root level")
        }
      }

    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`)
      console.error("Firebase test error:", error)
    }
  }

  const testLocalData = async () => {
    setTestResults([])
    addLog("📁 Testing local data access...")

    try {
      const response = await fetch("/data.json")
      addLog(`📡 Fetch response status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        addLog("✅ Local data loaded successfully")
        addLog(`📊 Local data keys: ${Object.keys(data).join(', ')}`)
        addLog(`🌡️ Temperature: ${data.temperature}`)
      } else {
        addLog(`❌ Failed to load local data: ${response.statusText}`)
      }
    } catch (error) {
      addLog(`❌ Local data error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Firebase Connection Debugger</CardTitle>
        <p className="text-sm text-gray-600">
          Testing connection to Singapore region database
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testFirebaseConnection}>
            Test Firebase Connection
          </Button>
          <Button onClick={testLocalData} variant="outline">
            Test Local Data
          </Button>
        </div>
        
        {testResults.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="space-y-1 text-sm font-mono">
              {testResults.map((result, index) => (
                <div key={index} className="text-gray-800">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
