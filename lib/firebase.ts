"use client"

import { initializeApp } from 'firebase/app'
import { getDatabase, Database } from 'firebase/database'

console.log("🔥 Firebase module loading at:", new Date().toISOString())

// Updated config with correct database URL for Singapore region
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

console.log("🔥 Firebase config (Singapore region):", firebaseConfig)

let app: any = null
let database: Database | null = null

try {
  console.log("🔥 Initializing Firebase app...")
  app = initializeApp(firebaseConfig)
  console.log("✅ Firebase app initialized:", !!app)
  
  console.log("🔥 Getting database instance...")
  database = getDatabase(app)
  console.log("✅ Database instance created:", !!database)
  console.log("✅ Database URL:", database?.app?.options?.databaseURL)
} catch (error) {
  console.error("❌ Firebase initialization failed:", error)
  console.error("❌ Error details:", error instanceof Error ? error.message : String(error))
}

console.log("🔥 Final exports - app:", !!app, "database:", !!database)

export { database }
export default app
