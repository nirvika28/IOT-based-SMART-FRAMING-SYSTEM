"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Thermometer, Droplets, Sun, Sprout, MilkIcon as Cow, AlertTriangle, CheckCircle, Activity, MapPin, Calendar, TrendingUp, Wifi, RefreshCw, Database, WifiOff } from 'lucide-react'

import { useNotifications } from "@/components/notifications/notification-provider"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { EnvironmentalChart } from "@/components/charts/environmental-chart"
import { ReportsAnalytics } from "@/components/charts/reports-analytics"
import { useFarmData } from "@/hooks/use-farm-data"
import { VirtualAssistant } from "@/components/assistant/virtual-assistant"

export function DashboardContent() {
  console.log("📊 Rendering dashboard content...")
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const { farmData, loading, error, updateDashboard, refetch, isFirebaseConnected } = useFarmData()
  const { checkThresholds } = useNotifications()

  const [autoIrrigation, setAutoIrrigation] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Update auto irrigation when farmData changes
  useEffect(() => {
    if (farmData) {
      console.log("💧 Updating irrigation state:", farmData.autoIrrigation)
      setAutoIrrigation(farmData.autoIrrigation)
    }
  }, [farmData])

  // Check thresholds when farmData updates - only for critical situations
  useEffect(() => {
    if (farmData) {
      console.log("🔍 Setting up threshold monitoring...")
      const timer = setTimeout(() => {
        checkThresholds(farmData)
      }, 5000)

      const interval = setInterval(() => {
        checkThresholds(farmData)
      }, 300000) // Check every 5 minutes

      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    }
  }, [farmData, checkThresholds])

  const handleAutoIrrigationChange = (checked: boolean) => {
    console.log("💧 Irrigation toggle changed:", checked)
    setAutoIrrigation(checked)
    updateDashboard({ autoIrrigation: checked })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "low":
        return "text-green-600"
      case "moderate":
        return "text-yellow-600"
      case "high":
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "moderate":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "high":
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  console.log("📊 Dashboard state:", { loading, error, farmData: !!farmData, isFirebaseConnected })

  if (loading) {
    console.log("⏳ Showing loading state...")
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-lg text-gray-600">Loading farm data...</p>
          <p className="text-sm text-gray-500 mt-2">
            {isFirebaseConnected ? "🔥 Connecting to Firebase..." : "📁 Loading local data..."}
          </p>
          <div className="mt-4 text-xs text-gray-400">
            <p>Check browser console for detailed logs</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !farmData) {
    console.log("❌ Showing error state:", error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p><strong>Error:</strong> {error}</p>
              <p className="text-xs text-gray-500">Check browser console for details</p>
              <Button onClick={refetch} className="mt-2" size="sm">
                Retry Connection
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!farmData) {
    console.log("❌ No farm data available")
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p className="text-lg text-gray-600">No farm data available</p>
          <p className="text-sm text-gray-500 mt-2">Check browser console for details</p>
          <Button onClick={refetch} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  console.log("✅ Rendering full dashboard with data:", farmData)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Notification Center */}
        <div className="relative text-center space-y-2">
          <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              isFirebaseConnected 
                ? "text-green-600 bg-green-50" 
                : "text-orange-600 bg-orange-50"
            }`}>
              {isFirebaseConnected ? (
                <>
                  <Database className="h-3 w-3" />
                  <span>🔥 Firebase Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>📁 Local Data</span>
                </>
              )}
            </div>
            <NotificationCenter />
          </div>

          <h1 className="text-4xl font-bold text-gray-900">Smart Farming System</h1>
          <p className="text-lg text-gray-600">Real-time Environmental Monitoring Dashboard</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{currentTime.toLocaleString()}</span>
          </div>
          
          {/* Show error message if Firebase failed but we have local data */}
          {error && farmData && (
            <div className="max-w-md mx-auto mt-2">
              <Alert className="text-left">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {error} - Dashboard showing cached data
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="livestock">Livestock</TabsTrigger>
            <TabsTrigger value="assistant">Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className={isFirebaseConnected ? "border-green-200" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                  <Thermometer className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" id="tempValue">
                    {farmData.temperature}°C
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isFirebaseConnected ? "🔥 Live data" : "📁 Cached"}
                  </p>
                </CardContent>
              </Card>

              <Card className={isFirebaseConnected ? "border-green-200" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                  <Droplets className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" id="humidityValue">
                    {farmData.humidity}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isFirebaseConnected ? "🔥 Live data" : "📁 Cached"}
                  </p>
                </CardContent>
              </Card>

              <Card className={isFirebaseConnected ? "border-green-200" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
                  <Droplets className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" id="moistureValue">
                    {farmData.soilMoisture}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isFirebaseConnected ? "🔥 Live data" : "📁 Cached"}
                  </p>
                </CardContent>
              </Card>

              <Card className={isFirebaseConnected ? "border-green-200" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Light Intensity</CardTitle>
                  <Sun className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" id="lightValue">
                    {farmData.lightIntensity} lux
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isFirebaseConnected ? "🔥 Live data" : "📁 Cached"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card id="cropInfo">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-green-600" />
                    Crop Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold" id="cropName">
                        {farmData.crop}
                      </p>
                      <p className="text-sm text-gray-600" id="growthStage">
                        {farmData.growthStage}
                      </p>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(farmData.healthStatus || "Moderate")} id="healthStatus">
                      {farmData.healthStatus || "Moderate"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    Irrigation System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto Irrigation</span>
                      <Switch 
                        checked={autoIrrigation} 
                        onCheckedChange={handleAutoIrrigationChange}
                        disabled={!isFirebaseConnected}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      Last irrigation: {new Date(farmData.lastIrrigationTime).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Today's count: {farmData.irrigationCount}</div>
                    {!isFirebaseConnected && (
                      <p className="text-xs text-orange-600">Controls disabled - Firebase offline</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card id="animalStatusSection">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cow className="h-5 w-5 text-brown-600" />
                    Livestock Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2" id="animalStatus">
                    {farmData.animals.map((animal) => (
                      <div key={animal.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{animal.id}</span>
                        <Badge variant="outline">{animal.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plant Vitality Section */}
            <Card id="plantVitality">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Plant Vitality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Disease Risk</p>
                  <p className={`font-semibold ${getStatusColor(farmData.diseaseRisk)}`} id="diseaseRisk">
                    {farmData.diseaseRisk}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">NDVI Index</p>
                  <p className="font-semibold" id="ndvi">
                    {farmData.ndvi}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chlorophyll Index</p>
                  <p className="font-semibold" id="chlorophyll">
                    {farmData.chlorophyllIndex}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Environmental Trends Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Environmental Trends</h2>
              <Card>
                <CardHeader>
                  <CardTitle>24-Hour Environmental Data</CardTitle>
                  <CardDescription>Real-time monitoring of key environmental metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <EnvironmentalChart />
                </CardContent>
              </Card>
            </div>

            {/* Reports & Analytics Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
              <ReportsAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="environment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Metrics</CardTitle>
                  <CardDescription>Current sensor readings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Temperature</span>
                      <span>{farmData.temperature}°C</span>
                    </div>
                    <Progress value={(farmData.temperature / 40) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Humidity</span>
                      <span>{farmData.humidity}%</span>
                    </div>
                    <Progress value={farmData.humidity} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Soil Moisture</span>
                      <span>{farmData.soilMoisture}%</span>
                    </div>
                    <Progress value={farmData.soilMoisture} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Light Intensity</span>
                      <span>{farmData.lightIntensity} lux</span>
                    </div>
                    <Progress value={(farmData.lightIntensity / 1000) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>IoT system health monitoring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Source</span>
                    <Badge variant="outline" className={isFirebaseConnected ? "text-green-600" : "text-orange-600"}>
                      {isFirebaseConnected ? "🔥 Firebase Live" : "📁 Local Cache"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sensors</span>
                    <Badge variant="outline" className="text-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Connectivity</span>
                    <Badge variant="outline" className={isFirebaseConnected ? "text-green-600" : "text-orange-600"}>
                      {isFirebaseConnected ? "Strong" : "Offline"}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last update: {currentTime.toLocaleString()}
                  </div>
                  {!isFirebaseConnected && (
                    <Button onClick={refetch} size="sm" className="w-full">
                      Reconnect to Firebase
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crops" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    Crop Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Crop Type</p>
                      <p className="font-semibold">{farmData.crop}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Growth Stage</p>
                      <p className="font-semibold">{farmData.growthStage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Health Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(farmData.healthStatus || "Moderate")}
                        <span className={`font-semibold ${getStatusColor(farmData.healthStatus || "Moderate")}`}>
                          {farmData.healthStatus || "Moderate"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Disease Risk</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(farmData.diseaseRisk)}
                        <span className={`font-semibold ${getStatusColor(farmData.diseaseRisk)}`}>
                          {farmData.diseaseRisk}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Plant Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>NDVI Index</span>
                      <span>{farmData.ndvi}</span>
                    </div>
                    <Progress value={farmData.ndvi * 100} className="h-2" />
                    <p className="text-xs text-gray-600">Vegetation health indicator</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Chlorophyll Index</span>
                      <span>{farmData.chlorophyllIndex}</span>
                    </div>
                    <Progress value={(farmData.chlorophyllIndex / 50) * 100} className="h-2" />
                    <p className="text-xs text-gray-600">Photosynthesis efficiency</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="livestock" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmData.animals.map((animal) => (
                <Card key={animal.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cow className="h-5 w-5" />
                      {animal.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{animal.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <Badge variant="secondary">{animal.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assistant" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <VirtualAssistant />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
