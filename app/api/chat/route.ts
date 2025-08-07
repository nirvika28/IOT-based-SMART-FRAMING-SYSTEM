import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

// Mock farm data for the assistant
const getMockFarmData = () => ({
  temperature: 26,
  humidity: 65,
  soilMoisture: 45,
  lightIntensity: 880,
  crop: 'Tomato',
  growthStage: 'Flowering',
  diseaseRisk: 'Moderate',
  healthStatus: 'Healthy',
  autoIrrigation: false,
  lastIrrigationTime: '2025-08-07T09:30:00Z',
  ndvi: 0.67,
  chlorophyllIndex: 32
})

// Helper function to analyze watering conditions
function analyzeWateringConditions(farmData: any) {
  const { soilMoisture, temperature, humidity, diseaseRisk } = farmData
  
  let recommendation = 'safe'
  let reasons = []
  
  if (soilMoisture > 70) {
    recommendation = 'not_recommended'
    reasons.push('soil moisture is high (risk of overwatering)')
  } else if (soilMoisture < 30) {
    recommendation = 'highly_recommended'
    reasons.push('soil moisture is low (plants need water)')
  }
  
  if (temperature > 35) {
    recommendation = 'not_recommended'
    reasons.push('temperature is very high (water may evaporate quickly)')
  } else if (temperature < 10) {
    recommendation = 'not_recommended'
    reasons.push('temperature is too low (plants absorb water slowly)')
  }
  
  if (diseaseRisk === 'High' && humidity > 80) {
    recommendation = 'not_recommended'
    reasons.push('high disease risk with high humidity (fungal growth risk)')
  }
  
  return { recommendation, reasons, soilMoisture, temperature, humidity }
}

// Simple AI response generator
function generateFarmBotResponse(message: string, farmData: any): string {
  const lowerMessage = message.toLowerCase()
  
  // Water/irrigation questions
  if (lowerMessage.includes('water') || lowerMessage.includes('irrigat')) {
    const analysis = analyzeWateringConditions(farmData)
    let response = `🚿 **Watering Analysis:**\n\n`
    
    if (analysis.recommendation === 'highly_recommended') {
      response += `✅ **YES, it's highly recommended to water now!**\n\n`
    } else if (analysis.recommendation === 'safe') {
      response += `✅ **Yes, it's safe to water now.**\n\n`
    } else {
      response += `⚠️ **Not recommended to water right now.**\n\n`
    }
    
    response += `**Current Conditions:**\n`
    response += `• Soil Moisture: ${analysis.soilMoisture}%\n`
    response += `• Temperature: ${analysis.temperature}°C\n`
    response += `• Humidity: ${analysis.humidity}%\n\n`
    
    if (analysis.reasons.length > 0) {
      response += `**Reasons:** ${analysis.reasons.join(', ')}\n\n`
    }
    
    response += `Last irrigation: ${new Date(farmData.lastIrrigationTime).toLocaleString()}`
    return response
  }
  
  // Humidity questions
  if (lowerMessage.includes('humidity')) {
    return `💧 **Current Humidity:** ${farmData.humidity}%\n\n` +
           `This is ${farmData.humidity > 70 ? 'high' : farmData.humidity > 40 ? 'moderate' : 'low'} humidity. ` +
           `${farmData.humidity > 70 ? 'Good for plant growth but watch for fungal diseases.' : 
             farmData.humidity > 40 ? 'Ideal range for most crops.' : 'Consider increasing humidity for better growth.'}`
  }
  
  // Temperature questions
  if (lowerMessage.includes('temperature') || lowerMessage.includes('temp')) {
    return `🌡️ **Current Temperature:** ${farmData.temperature}°C\n\n` +
           `This is ${farmData.temperature > 30 ? 'hot' : farmData.temperature > 20 ? 'warm' : farmData.temperature > 10 ? 'cool' : 'cold'} weather. ` +
           `${farmData.temperature > 30 ? 'Ensure adequate watering and shade.' : 
             farmData.temperature > 20 ? 'Perfect temperature for tomato growth!' : 'Plants may grow slower in cooler weather.'}`
  }
  
  // Weather summary
  if (lowerMessage.includes('weather')) {
    const tempCategory = farmData.temperature > 30 ? 'hot' : farmData.temperature > 20 ? 'warm' : 'cool'
    const humidityCategory = farmData.humidity > 70 ? 'humid' : farmData.humidity > 40 ? 'moderate' : 'dry'
    const lightCategory = farmData.lightIntensity > 500 ? 'sunny' : farmData.lightIntensity > 200 ? 'partly cloudy' : 'cloudy'
    
    return `🌤️ **Today's Weather Summary:**\n\n` +
           `• **Temperature:** ${farmData.temperature}°C (${tempCategory})\n` +
           `• **Humidity:** ${farmData.humidity}% (${humidityCategory})\n` +
           `• **Light:** ${farmData.lightIntensity} lux (${lightCategory})\n\n` +
           `Overall conditions are ${tempCategory === 'warm' && humidityCategory === 'moderate' ? 'excellent' : 'good'} for farming today! 🌱`
  }
  
  // Soil moisture questions
  if (lowerMessage.includes('soil') || lowerMessage.includes('moisture')) {
    return `🌱 **Soil Moisture:** ${farmData.soilMoisture}%\n\n` +
           `${farmData.soilMoisture > 70 ? '⚠️ High - Risk of overwatering' : 
             farmData.soilMoisture > 30 ? '✅ Good - Plants have adequate water' : 
             '🚨 Low - Plants need watering soon'}\n\n` +
           `Optimal range for tomatoes is 40-60%.`
  }
  
  // Crop health questions
  if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('tomato') || lowerMessage.includes('health')) {
    return `🍅 **Crop Health Report:**\n\n` +
           `• **Crop:** ${farmData.crop}\n` +
           `• **Growth Stage:** ${farmData.growthStage}\n` +
           `• **Health Status:** ${farmData.healthStatus}\n` +
           `• **Disease Risk:** ${farmData.diseaseRisk}\n` +
           `• **NDVI Index:** ${farmData.ndvi} (vegetation health)\n` +
           `• **Chlorophyll:** ${farmData.chlorophyllIndex}\n\n` +
           `${farmData.healthStatus === 'Healthy' ? '✅ Your crops are doing well!' : 
             '⚠️ Monitor closely and consider adjusting care routine.'}`
  }
  
  // Disease risk questions
  if (lowerMessage.includes('disease') || lowerMessage.includes('risk')) {
    return `🦠 **Disease Risk Assessment:**\n\n` +
           `Current risk level: **${farmData.diseaseRisk}**\n\n` +
           `${farmData.diseaseRisk === 'Low' ? '✅ Low risk - Continue current care routine.' :
             farmData.diseaseRisk === 'Moderate' ? '⚠️ Moderate risk - Monitor plants closely and ensure good air circulation.' :
             '🚨 High risk - Take preventive measures immediately!'}\n\n` +
           `Factors: Temperature ${farmData.temperature}°C, Humidity ${farmData.humidity}%`
  }
  
  // Default response
  return `🌱 Hello! I'm FarmBot, your farming assistant. I can help you with:\n\n` +
         `• **Watering decisions** - "Is it safe to water now?"\n` +
         `• **Current conditions** - "What's the humidity?"\n` +
         `• **Weather summary** - "How was the weather today?"\n` +
         `• **Crop health** - "How are my plants doing?"\n` +
         `• **Disease monitoring** - "What's the disease risk?"\n\n` +
         `What would you like to know about your farm? 🚜`
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }
    
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 })
    }
    
    // Get farm data (in real app, this would come from Firebase)
    const farmData = getMockFarmData()
    
    // Generate response
    const response = generateFarmBotResponse(lastMessage.content, farmData)
    
    // Return streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Simulate streaming by sending response in chunks
        const chunks = response.split(' ')
        let index = 0
        
        const sendChunk = () => {
          if (index < chunks.length) {
            const chunk = chunks[index] + ' '
            const data = `0:${JSON.stringify({ type: 'text-delta', textDelta: chunk })}\n`
            controller.enqueue(encoder.encode(data))
            index++
            setTimeout(sendChunk, 50) // Simulate typing effect
          } else {
            controller.close()
          }
        }
        
        sendChunk()
      }
    })
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
    
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
