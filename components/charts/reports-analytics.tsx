"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Droplets } from "lucide-react"

export function ReportsAnalytics() {
  const handleDownloadCSV = () => {
    // Simulate CSV download
    const csvContent = `Date,Temperature,Humidity,Soil Moisture,Light Intensity
2025-08-02,25,65,45,230
2025-08-01,24,68,42,220
2025-07-31,26,62,48,240`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "environmental-data.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Historical Reports Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Download className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Historical Reports</CardTitle>
              <CardDescription>Environmental data summary and insights</CardDescription>
            </div>
          </div>
          <Button onClick={handleDownloadCSV} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </CardHeader>
      </Card>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg Temperature
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25°C</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg Humidity
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg Soil Moisture
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Total Irrigations
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
