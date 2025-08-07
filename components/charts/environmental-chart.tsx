"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Generate 24-hour sample data
const generateHourlyData = () => {
  const data = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hour = time.getHours()

    // Simulate realistic environmental patterns
    const baseTemp = 24 + Math.sin(((hour - 6) * Math.PI) / 12) * 8 + (Math.random() - 0.5) * 2
    const baseHumidity = 65 + Math.sin(((hour - 12) * Math.PI) / 12) * 15 + (Math.random() - 0.5) * 5
    const baseSoilMoisture = 45 + Math.sin(((hour - 8) * Math.PI) / 12) * 10 + (Math.random() - 0.5) * 3
    const baseLightIntensity =
      hour >= 6 && hour <= 18
        ? 200 + Math.sin(((hour - 12) * Math.PI) / 6) * 150 + (Math.random() - 0.5) * 50
        : 10 + (Math.random() - 0.5) * 5

    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      fullTime: time.toLocaleString(),
      temperature: Math.max(0, Math.round(baseTemp * 100) / 100),
      humidity: Math.max(0, Math.min(100, Math.round(baseHumidity * 100) / 100)),
      soilMoisture: Math.max(0, Math.min(100, Math.round(baseSoilMoisture * 100) / 100)),
      lightIntensity: Math.max(0, Math.round(baseLightIntensity * 100) / 100),
    })
  }

  return data
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
            {entry.dataKey === "temperature" && "°C"}
            {(entry.dataKey === "humidity" || entry.dataKey === "soilMoisture") && "%"}
            {entry.dataKey === "lightIntensity" && " lux"}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function EnvironmentalChart() {
  const data = generateHourlyData()

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" stroke="#666" fontSize={12} interval="preserveStartEnd" />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
            name="Temperature (°C)"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            name="Humidity (%)"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="soilMoisture"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
            name="Soil Moisture (%)"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="lightIntensity"
            stroke="#eab308"
            strokeWidth={2}
            dot={{ fill: "#eab308", strokeWidth: 2, r: 4 }}
            name="Light (lux)"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
