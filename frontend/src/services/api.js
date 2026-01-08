/**
 * API client for Livestock AI Platform
 * Handles offline queueing and retry logic
 */

import axios from 'axios'
import { queueRequest, processQueue } from '../utils/offlineQueue'

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
      if (!navigator.onLine || error.code === 'ERR_NETWORK') {
        // Queue for later
        await queueRequest({
          method: 'POST',
          url: '/predict-breed',
          data: { image_base64: imageBase64, region },
          type: 'breed_prediction'
        })
        throw new Error('You are offline. Request queued and will be sent when connection is restored.')
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. The model might be taking too long to process the image. Please try again or with a smaller image.')
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.detail || 'Invalid request. Please check your image and try again.')
      }
      throw error
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
      if (!navigator.onLine || error.code === 'ERR_NETWORK') {
        await queueRequest({
          method: 'POST',
          url: '/predict-risk',
          data: { image_base64: imageBase64, breed, region },
          type: 'risk_assessment'
        })
        throw new Error('You are offline. Request queued and will be sent when connection is restored.')
      }
      throw error
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
      if (!navigator.onLine || error.code === 'ERR_NETWORK') {
        await queueRequest({
          method: 'POST',
          url: '/ask-advisor',
          data: { question, language, context, region },
          type: 'advisor_query'
        })
        throw new Error('You are offline. Request queued and will be sent when connection is restored.')
      }
      throw error
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
      if (!navigator.onLine || error.code === 'ERR_NETWORK') {
        await queueRequest({
          method: 'POST',
          url: '/submit-feedback',
          data: feedback,
          type: 'feedback'
        })
        // Don't throw error for feedback - it's okay to queue it
        return {
          feedback_id: 'queued',
          status: 'queued',
          message: 'Feedback queued and will be submitted when connection is restored.'
        }
      }
      throw error
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
      if (!navigator.onLine || error.code === 'ERR_NETWORK') {
        throw new Error('You are offline. Please check your connection and try again.')
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.')
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.detail || 'Invalid request. Please check your filters.')
      }
      throw new Error(error.message || 'Failed to fetch trends data')
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
      if (error.response?.status === 500) {
        throw new Error('Server error generating report. Please try again.')
      }
      throw new Error(error.response?.data?.detail || 'Failed to generate report')
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
      if (error.response?.status === 500) {
        throw new Error('Server error processing batch. Please try again.')
      }
      throw new Error(error.response?.data?.detail || 'Failed to process batch')
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
      throw new Error(error.response?.data?.detail || 'Failed to perform comparison')
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
      throw new Error(error.response?.data?.detail || 'Failed to get recommendations')
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
      throw new Error('Failed to generate QR code')
    }
  }
}

export default apiClient
