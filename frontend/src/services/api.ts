/**
 * API client for Livestock AI Platform Backend
 * Connects the saeecattle frontend to the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Helper function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to handle API errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export interface BreedPredictionResponse {
  breed: string;
  confidence: number;
  trust_score: number;
  regional_validity: number;
  explanation: string;
  grad_cam_heatmap?: string;
  disclaimer: string;
  top_3_predictions?: Array<{ breed: string; confidence: number }>;
}

export interface RiskPredictionResponse {
  risk_level: 'Low' | 'Medium' | 'High';
  confidence: number;
  trust_score: number;
  visual_cues: Array<{
    cue: string;
    value: string;
    confidence: number;
    description: string;
  }>;
  factors: string[];
  explanation: string;
  grad_cam_heatmap?: string;
  disclaimer: string;
}

export interface AdvisorResponse {
  answer: string;
  sources: string[];
  confidence: number;
  disclaimer: string;
}

export interface HealthTrendsResponse {
  period: string;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
  };
  time_series: Array<{
    date: string;
    low: number;
    medium: number;
    high: number;
  }>;
  breed_trends: Array<{
    breed: string;
    low: number;
    medium: number;
    high: number;
  }>;
  regional_comparison: {
    current_region: { low: number; medium: number; high: number };
    national_average: { low: number; medium: number; high: number };
  };
}

// Breed Identification API
export const breedAPI = {
  async predictBreed(imageBase64: string, region?: string): Promise<BreedPredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/predict-breed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_base64: imageBase64,
        region: region,
      }),
    });

    return handleResponse(response);
  },
};

// Health Risk Assessment API
export const riskAPI = {
  async assessRisk(
    imageBase64: string,
    breed?: string,
    region?: string
  ): Promise<RiskPredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/predict-risk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_base64: imageBase64,
        breed: breed,
        region: region,
      }),
    });

    return handleResponse(response);
  },
};

// AI Advisor API
export const advisorAPI = {
  async askAdvisor(
    question: string,
    language: string = 'en',
    context?: Record<string, any>,
    region?: string
  ): Promise<AdvisorResponse> {
    const response = await fetch(`${API_BASE_URL}/ask-advisor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
        language: language,
        context: context,
        region: region,
      }),
    });

    return handleResponse(response);
  },
};

// Health Trends API
export const trendsAPI = {
  async getHealthTrends(
    state?: string,
    district?: string,
    period: string = 'last_30_days'
  ): Promise<HealthTrendsResponse> {
    const params = new URLSearchParams({ period });
    if (state) params.append('state', state);
    if (district) params.append('district', district);

    const response = await fetch(`${API_BASE_URL}/health-trends?${params.toString()}`);

    return handleResponse(response);
  },
};

// Feedback API
export const feedbackAPI = {
  async submitFeedback(data: {
    prediction_id?: string;
    prediction_type: 'breed' | 'risk';
    rating: number;
    comment?: string;
    outcome?: string;
    region?: string;
  }): Promise<{ feedback_id: string; status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/submit-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },
};

// Health check
export const healthCheck = async (): Promise<{ status: string; service: string }> => {
  const response = await fetch('http://localhost:8000/health');
  return handleResponse(response);
};
