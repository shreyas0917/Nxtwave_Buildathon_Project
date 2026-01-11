/**
 * API client for Livestock AI Platform
 * Handles offline queueing and retry logic
 * Falls back to mock data when backend is unavailable
 */

import axios from 'axios'
import { queueRequest, processQueue } from '../utils/offlineQueue'
import {
  generateMockBreedPrediction,
  generateMockRiskAssessment,
  generateMockAdvisorResponse,
  generateMockTrendsData,
  generateMockBatchResults,
  generateMockRecommendations
} from '../utils/mockData'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60 seconds for ML inference
  headers: {
    'Content-Type': 'application/json'
  }
})

// Process queue when coming online
window.addEventListener('online', () => {
  console.log('Connection restored, processing queued requests...')
  processQueue(apiClient)
})

// Also process queue on page load if online
if (navigator.onLine) {
  // Small delay to ensure everything is initialized
  setTimeout(() => processQueue(apiClient), 1000)
}

// Breed API
export const breedAPI = {
  async predictBreed(imageBase64, region = null) {
    try {
      // Create a separate client with longer timeout for breed prediction
      const breedClient = axios.create({
        baseURL: API_BASE_URL,
        timeout: 90000, // 90 seconds for ML inference
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await breedClient.post('/predict-breed', {
        image_base64: imageBase64,
        region
      })
      return response.data
    } catch (error) {
      // Always use mock data on any error
      console.log('Backend unavailable, using mock breed prediction')
      return generateMockBreedPrediction(region)
    }
  }
}

// Risk API
export const riskAPI = {
  async assessRisk(imageBase64, breed = null, region = null) {
    try {
      // Create a separate client with longer timeout for risk assessment
      const riskClient = axios.create({
        baseURL: API_BASE_URL,
        timeout: 90000, // 90 seconds for ML inference
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await riskClient.post('/predict-risk', {
        image_base64: imageBase64,
        breed,
        region
      })
      return response.data
    } catch (error) {
      // Always use mock data on any error
      console.log('Backend unavailable, using mock risk assessment')
      return generateMockRiskAssessment()
    }
  }
}

// Advisor API
export const advisorAPI = {
  async askAdvisor(question, language = 'en', context = null, region = null) {
    try {
      const response = await apiClient.post('/ask-advisor', {
        question,
        language,
        context,
        region
      })
      return response.data
    } catch (error) {
      // Always use mock data on any error
      console.log('Backend unavailable, using mock advisor response')
      return generateMockAdvisorResponse(question)
    }
  },
  
  async chat(message, conversationHistory = [], language = 'en', context = null, region = null) {
    try {
      const response = await apiClient.post('/chat', {
        message,
        conversation_history: conversationHistory,
        language,
        context,
        region
      })
      return response.data
    } catch (error) {
      // Always use mock data on any error
      console.log('Backend unavailable, using mock chat response')
      const mockResponse = generateMockAdvisorResponse(message)
      const updatedHistory = [...conversationHistory, 
        { role: 'user', content: message },
        { role: 'assistant', content: mockResponse.answer }
      ]
      return {
        message: mockResponse.answer,
        conversation_history: updatedHistory,
        sources: mockResponse.sources,
        confidence: mockResponse.confidence
      }
    }
  }
}

// Feedback API
export const feedbackAPI = {
  async submitFeedback(feedback) {
    try {
      const response = await apiClient.post('/submit-feedback', feedback)
      return response.data
    } catch (error) {
      // Return success for feedback even if backend fails
      return {
        feedback_id: 'mock',
        status: 'success',
        message: 'Feedback received (using mock mode)'
      }
    }
  }
}

// Trends API
export const trendsAPI = {
  async getTrends(district = null, state = null, period = 'last_30_days') {
    try {
      const params = { period }
      if (district) params.district = district
      if (state) params.state = state

      const response = await apiClient.get('/health-trends', { params })
      return response.data
    } catch (error) {
      // Always use mock data on any error
      console.log('Backend unavailable, using mock trends data')
      return generateMockTrendsData(district, state, period)
    }
  }
}

// Reports API
export const reportsAPI = {
  async generateReport(request) {
    try {
      const response = await apiClient.post('/generate-report', request)
      return response.data
    } catch (error) {
      // Use mock report data
      console.log('Backend unavailable, using mock report data')
      const reportId = `REP-${Date.now()}`
      return {
        report_id: reportId,
        generated_at: new Date().toISOString(),
        pdf_url: `#`, // Placeholder
        summary: {
          total_assessments: 1,
          average_confidence: 0.87
        }
      }
    }
  },
  
  async downloadReport(reportId) {
    try {
      const response = await apiClient.get(`/download-report/${reportId}`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to download report')
    }
  }
}

// Batch Processing API
export const batchAPI = {
  async processBatch(images, animalIds = null, region = null) {
    try {
      const batchClient = axios.create({
        baseURL: API_BASE_URL,
        timeout: 300000, // 5 minutes for batch processing
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await batchClient.post('/batch-assess', {
        images,
        animal_ids: animalIds,
        region
      })
      return response.data
    } catch (error) {
      // Use mock batch results
      console.log('Backend unavailable, using mock batch results')
      const results = generateMockBatchResults(images.length)
      return {
        total_processed: images.length,
        success_count: results.length,
        error_count: 0,
        results: results
      }
    }
  }
}

// Comparison API
export const comparisonAPI = {
  async compare(comparisonType, items, period = 'last_30_days') {
    try {
      const response = await apiClient.post('/compare', {
        comparison_type: comparisonType,
        items,
        period
      })
      return response.data
    } catch (error) {
      // Use mock comparison data
      console.log('Backend unavailable, using mock comparison data')
      const itemsData = comparisonType === 'breed' 
        ? items.map(item => ({
            name: item,
            total_assessments: 50 + Math.floor(Math.random() * 100),
            low_risk_pct: 60 + Math.random() * 10,
            medium_risk_pct: 25 + Math.random() * 8,
            high_risk_pct: 5 + Math.random() * 5,
            avg_confidence: 0.85 + Math.random() * 0.10
          }))
        : items.map(item => ({
            name: item,
            total_assessments: 100 + Math.floor(Math.random() * 200),
            low_risk_pct: 62 + Math.random() * 8,
            medium_risk_pct: 28 + Math.random() * 7,
            high_risk_pct: 7 + Math.random() * 3
          }))
      
      return {
        items: itemsData,
        insights: [
          `Comparison shows variations in risk levels across ${comparisonType === 'breed' ? 'breeds' : comparisonType === 'time' ? 'time periods' : 'regions'}`,
          'Overall health trends appear stable with minor variations',
          'Recommend monitoring areas with higher risk percentages'
        ]
      }
    }
  }
}

// Recommendations API
export const recommendationsAPI = {
  async getRecommendations(request) {
    try {
      const response = await apiClient.post('/recommendations', request)
      return response.data
    } catch (error) {
      // Use mock recommendations
      console.log('Backend unavailable, using mock recommendations')
      return generateMockRecommendations(request.breed, request.risk_level)
    }
  }
}

// QR Code API
export const qrcodeAPI = {
  async generateQR(animalId, breed = null) {
    try {
      const response = await apiClient.get(`/generate-qr/${animalId}`, {
        params: { breed },
        responseType: 'blob'
      })
      return URL.createObjectURL(response.data)
    } catch (error) {
      // Fallback: Generate QR code using client-side library or placeholder
      console.log('Backend unavailable, generating placeholder QR code')
      // Create a data URL for a simple QR code placeholder
      const canvas = document.createElement('canvas')
      canvas.width = 200
      canvas.height = 200
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 200, 200)
      ctx.fillStyle = '#000'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('QR', 100, 90)
      ctx.font = '14px Arial'
      ctx.fillText(animalId, 100, 120)
      return canvas.toDataURL('image/png')
    }
  }
}

export default apiClient
