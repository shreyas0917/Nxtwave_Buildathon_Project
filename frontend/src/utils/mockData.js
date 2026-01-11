/**
 * Mock Data Generators
 * Generates realistic fake data for frontend when backend is unavailable
 */

// Indian livestock breeds
const INDIAN_BREEDS = [
  'Gir', 'Sahiwal', 'Red Sindhi', 'Tharparkar', 'Kankrej',
  'Ongole', 'Hariana', 'Krishna Valley', 'Deoni', 'Rathi',
  'Murrah', 'Jaffarabadi', 'Surti', 'Mehsana', 'Bhadawari',
  'Nili-Ravi', 'Pandharpuri', 'Nagpuri', 'Toda'
]

// Indian states
const INDIAN_STATES = [
  'Gujarat', 'Maharashtra', 'Punjab', 'Haryana', 'Rajasthan',
  'Uttar Pradesh', 'Madhya Pradesh', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka'
]

// Visual cues for risk assessment
const VISUAL_CUES = [
  { name: 'Body Condition Score', descriptions: ['Good body condition', 'Moderate body condition', 'Thin body condition - may need nutritional support'] },
  { name: 'Coat Quality', descriptions: ['Healthy shiny coat', 'Moderate coat quality', 'Dull coat - may indicate health concerns'] },
  { name: 'Eye/Nose Discharge', descriptions: ['Normal', 'Slight discharge observed', 'Discharge detected - consult veterinarian'] }
]

// Risk factors
const RISK_FACTORS = [
  'Body condition may need attention',
  'Coat quality indicates possible health concern',
  'Eye clarity is good',
  'No obvious visual concerns detected',
  'General health indicators appear normal'
]

// Advisor knowledge base snippets
const ADVISOR_RESPONSES = [
  'For optimal livestock health, ensure adequate clean water (40-50 liters daily for adult cattle) and balanced nutrition with green fodder, dry fodder, and concentrates.',
  'Monitor body condition score regularly. Thin animals may need nutritional support. Consult veterinarian for dietary adjustments.',
  'In summer months, provide adequate shade and ensure water supply. Watch for heat stress symptoms such as excessive panting or lethargy.',
  'Regular health monitoring is essential. Observe eating patterns, mobility, and general behavior daily.',
  'Vaccination schedules should be followed as recommended by veterinarians for your region.',
  'Proper housing with good ventilation helps prevent respiratory issues. Ensure adequate space per animal.',
  'Milk production can be improved with proper nutrition, adequate water, and stress-free environment.',
  'For breeding animals, maintain optimal body condition and consult with veterinarians for breeding programs.'
]

/**
 * Generate mock breed prediction
 */
export function generateMockBreedPrediction(region = null) {
  const breed = INDIAN_BREEDS[Math.floor(Math.random() * INDIAN_BREEDS.length)]
  const confidence = 0.85 + Math.random() * 0.10 // 85-95%
  const trustScore = 0.85 + Math.random() * 0.10 // 85-95%
  const regionalValidity = 0.85 + Math.random() * 0.10 // 85-95%

  // Top 3 predictions
  const top3 = [
    { breed, confidence },
    { breed: INDIAN_BREEDS[Math.floor(Math.random() * INDIAN_BREEDS.length)], confidence: confidence * 0.75 },
    { breed: INDIAN_BREEDS[Math.floor(Math.random() * INDIAN_BREEDS.length)], confidence: confidence * 0.60 }
  ]

  return {
    breed,
    confidence,
    trust_score: trustScore,
    regional_validity: regionalValidity,
    explanation: `High confidence match for ${breed} breed (${Math.round(confidence * 100)}% confidence). This breed is commonly found in Indian dairy farms and is known for its good milk production and adaptability.`,
    top_3_predictions: top3,
    grad_cam_heatmap: null // Can generate placeholder if needed
  }
}

/**
 * Generate mock risk assessment
 */
export function generateMockRiskAssessment() {
  const riskLevels = ['Low', 'Medium', 'High']
  const riskLevel = riskLevels[Math.floor(Math.random() * 3)]
  const confidence = 0.85 + Math.random() * 0.07 // 85-92%
  const trustScore = 0.85 + Math.random() * 0.10 // 85-95%

  // Generate visual cues
  const visualCues = VISUAL_CUES.map(cue => {
    const detected = Math.random() > 0.6
    const cueConfidence = 0.87 + Math.random() * 0.05 // 87-92%
    const descriptionIndex = Math.floor(Math.random() * cue.descriptions.length)
    
    return {
      cue_name: cue.name,
      detected,
      confidence: cueConfidence,
      description: cue.descriptions[descriptionIndex]
    }
  })

  // Generate factors
  const factors = [RISK_FACTORS[Math.floor(Math.random() * RISK_FACTORS.length)]]

  const explanations = {
    Low: 'Overall health indicators appear normal. Continue regular monitoring and maintain current care practices.',
    Medium: 'Some health indicators may need attention. Monitor closely and consider consulting a veterinarian for preventive care.',
    High: 'Multiple health indicators suggest potential concerns. Consult a qualified veterinarian for comprehensive health assessment and guidance.'
  }

  return {
    risk_level: riskLevel,
    confidence,
    trust_score: trustScore,
    visual_cues: visualCues,
    factors,
    explanation: explanations[riskLevel],
    grad_cam_heatmap: null
  }
}

/**
 * Generate mock advisor response
 */
export function generateMockAdvisorResponse(question) {
  const confidence = 0.85 + Math.random() * 0.07 // 85-92%
  const sources = [
    'ICAR Livestock Care Guidelines',
    'Veterinary Care Manual',
    'Regional Care Best Practices'
  ].slice(0, 1 + Math.floor(Math.random() * 2))

  // Generate response based on question keywords
  let response = ADVISOR_RESPONSES[Math.floor(Math.random() * ADVISOR_RESPONSES.length)]
  
  if (question.toLowerCase().includes('water')) {
    response = 'Ensure adequate clean water supply (40-50 liters daily for adult cattle). Water quality is crucial for health and milk production. Provide fresh water multiple times daily, especially during hot weather.'
  } else if (question.toLowerCase().includes('feed') || question.toLowerCase().includes('food') || question.toLowerCase().includes('nutrition')) {
    response = 'Balanced nutrition is essential. Provide green fodder, dry fodder, and concentrates in appropriate proportions. Consult with a veterinarian or livestock nutritionist for breed-specific dietary recommendations based on age, weight, and production stage.'
  } else if (question.toLowerCase().includes('health') || question.toLowerCase().includes('sick')) {
    response = 'Regular health monitoring is crucial. Observe eating patterns, mobility, body condition, and behavior daily. If you notice any concerning signs like loss of appetite, lethargy, or unusual behavior, consult a qualified veterinarian promptly.'
  } else if (question.toLowerCase().includes('milk') || question.toLowerCase().includes('production')) {
    response = 'Milk production can be optimized with proper nutrition, adequate water supply, stress-free environment, and regular health monitoring. Ensure balanced diet, good housing conditions, and timely veterinary care.'
  }

  return {
    answer: response,
    sources,
    confidence
  }
}

/**
 * Generate mock trends data
 */
export function generateMockTrendsData(district = null, state = null, period = 'last_30_days') {
  const days = period === 'last_7_days' ? 7 : period === 'last_90_days' ? 90 : 30
  const timeSeries = []
  const breedTrends = []
  const visualCueTrends = []

  // Generate time series
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))
    const dateStr = date.toISOString().split('T')[0]
    
    const total = 50 + Math.floor(Math.random() * 50)
    const lowRisk = Math.floor(total * (0.58 + Math.random() * 0.08)) // 58-66%
    const mediumRisk = Math.floor(total * (0.24 + Math.random() * 0.07)) // 24-31%
    const highRisk = total - lowRisk - mediumRisk

    timeSeries.push({
      date: dateStr,
      low_risk: lowRisk,
      medium_risk: mediumRisk,
      high_risk: highRisk,
      total,
      avg_confidence: 0.75 + Math.random() * 0.15
    })
  }

  // Generate breed trends
  const selectedBreeds = INDIAN_BREEDS.slice(0, 8)
  selectedBreeds.forEach(breed => {
    const total = 20 + Math.floor(Math.random() * 80)
    const lowRisk = Math.floor(total * (0.55 + Math.random() * 0.20))
    const mediumRisk = Math.floor(total * (0.25 + Math.random() * 0.15))
    const highRisk = total - lowRisk - mediumRisk

    breedTrends.push({
      breed,
      total_assessments: total,
      low_risk_count: lowRisk,
      medium_risk_count: mediumRisk,
      high_risk_count: highRisk,
      average_confidence: 0.72 + Math.random() * 0.18
    })
  })

  // Generate visual cue trends
  VISUAL_CUES.forEach(cue => {
    const total = 500 + Math.floor(Math.random() * 500)
    const detected = Math.floor(total * (0.15 + Math.random() * 0.25))

    visualCueTrends.push({
      cue_name: cue.name,
      detected_count: detected,
      total_count: total,
      detection_rate: detected / total
    })
  })

  // Calculate summary
  const totalAssessments = timeSeries.reduce((sum, point) => sum + point.total, 0)
  const totalLow = timeSeries.reduce((sum, point) => sum + point.low_risk, 0)
  const totalMedium = timeSeries.reduce((sum, point) => sum + point.medium_risk, 0)
  const totalHigh = timeSeries.reduce((sum, point) => sum + point.high_risk, 0)

  const locationName = district ? `${district}, ${state || 'All States'}` : state || 'All Regions'

  return {
    district: district || 'All Districts',
    state: state || 'All States',
    period,
    trends: timeSeries.map(point => ({
      date: point.date,
      risk_level: 'Low',
      count: point.low_risk,
      average_confidence: point.avg_confidence
    })).concat(
      timeSeries.map(point => ({
        date: point.date,
        risk_level: 'Medium',
        count: point.medium_risk,
        average_confidence: point.avg_confidence
      })),
      timeSeries.map(point => ({
        date: point.date,
        risk_level: 'High',
        count: point.high_risk,
        average_confidence: point.avg_confidence
      }))
    ),
    summary: {
      total_assessments: totalAssessments,
      low_risk_percentage: (totalLow / totalAssessments) * 100,
      medium_risk_percentage: (totalMedium / totalAssessments) * 100,
      high_risk_percentage: (totalHigh / totalAssessments) * 100,
      average_confidence: 0.75 + Math.random() * 0.15,
      low_risk_count: totalLow,
      medium_risk_count: totalMedium,
      high_risk_count: totalHigh
    },
    time_series: timeSeries,
    breed_trends: breedTrends.sort((a, b) => b.total_assessments - a.total_assessments),
    visual_cue_trends: visualCueTrends,
    regional_comparison: {
      current_region: {
        total: totalAssessments,
        low_risk_pct: (totalLow / totalAssessments) * 100,
        medium_risk_pct: (totalMedium / totalAssessments) * 100,
        high_risk_pct: (totalHigh / totalAssessments) * 100,
        avg_confidence: 0.75 + Math.random() * 0.15
      },
      neighboring_regions: [
        {
          name: 'Gujarat',
          total: totalAssessments + Math.floor(Math.random() * 500),
          low_risk_pct: 65 + Math.random() * 5,
          medium_risk_pct: 28 + Math.random() * 5,
          high_risk_pct: 6 + Math.random() * 3
        },
        {
          name: 'Maharashtra',
          total: totalAssessments + Math.floor(Math.random() * 300),
          low_risk_pct: 62 + Math.random() * 5,
          medium_risk_pct: 30 + Math.random() * 5,
          high_risk_pct: 7 + Math.random() * 3
        }
      ]
    },
    last_updated: new Date().toISOString(),
    disclaimer: `Trends for ${locationName} (${period.replace('_', ' ')}). Data is aggregated and anonymized. Individual predictions may vary. Data updates daily.`
  }
}

/**
 * Generate mock batch processing results
 */
export function generateMockBatchResults(count = 10) {
  const results = []
  for (let i = 0; i < count; i++) {
    results.push({
      animal_id: `Animal-${i + 1}`,
      breed: INDIAN_BREEDS[Math.floor(Math.random() * INDIAN_BREEDS.length)],
      confidence: 0.85 + Math.random() * 0.10,
      risk_level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      risk_confidence: 0.85 + Math.random() * 0.07,
      status: 'success',
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
    })
  }
  return results
}

/**
 * Generate mock recommendations
 */
export function generateMockRecommendations(breed = null, riskLevel = null) {
  const recommendations = [
    {
      category: 'Nutrition',
      priority: 'High',
      title: 'Balanced Diet',
      description: 'Ensure adequate green fodder, dry fodder, and concentrates in proper proportions.',
      estimated_impact: 'High - Improves overall health and milk production',
      action_items: [
        'Provide 15-20 kg of green fodder daily',
        'Include 2-3 kg of dry fodder',
        'Add concentrates based on production stage'
      ]
    },
    {
      category: 'Water Management',
      priority: 'High',
      title: 'Adequate Water Supply',
      description: 'Ensure clean, fresh water is available at all times.',
      estimated_impact: 'High - Essential for health and productivity',
      action_items: [
        'Provide 40-50 liters of water daily',
        'Ensure water quality is good',
        'Provide water multiple times daily in summer'
      ]
    },
    {
      category: 'Health Monitoring',
      priority: 'Medium',
      title: 'Regular Health Checks',
      description: 'Monitor body condition, eating patterns, and behavior daily.',
      estimated_impact: 'Medium - Early detection of health issues',
      action_items: [
        'Check body condition score weekly',
        'Observe eating patterns',
        'Monitor mobility and behavior'
      ]
    }
  ]

  if (riskLevel === 'High') {
    recommendations.unshift({
      category: 'Veterinary Consultation',
      priority: 'Urgent',
      title: 'Consult Veterinarian',
      description: 'Schedule a veterinary consultation for comprehensive health assessment.',
      estimated_impact: 'Critical - Immediate professional assessment needed',
      action_items: [
        'Contact local veterinarian',
        'Prepare health history',
        'Follow veterinary recommendations'
      ]
    })
  }

  return {
    recommendations,
    priority: riskLevel === 'High' ? 'Urgent' : riskLevel === 'Medium' ? 'High' : 'Medium',
    estimated_impact: riskLevel === 'High' ? 'Critical - Immediate action recommended' : 'Moderate to High - Preventive care essential',
    generated_at: new Date().toISOString(),
    validity_period: '30 days'
  }
}

/**
 * Generate mock analytics data
 */
export function generateMockAnalytics() {
  return {
    total_assessments: 1250 + Math.floor(Math.random() * 500),
    total_breeds_identified: 18,
    average_confidence: 0.87 + Math.random() * 0.05,
    risk_distribution: {
      low: 62 + Math.random() * 5,
      medium: 28 + Math.random() * 5,
      high: 8 + Math.random() * 3
    },
    top_breeds: INDIAN_BREEDS.slice(0, 5).map(breed => ({
      breed,
      count: 50 + Math.floor(Math.random() * 100),
      percentage: 15 + Math.random() * 10
    })),
    regional_stats: INDIAN_STATES.slice(0, 5).map(state => ({
      state,
      assessments: 100 + Math.floor(Math.random() * 200),
      avg_confidence: 0.85 + Math.random() * 0.10
    })),
    monthly_trend: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      assessments: 80 + Math.floor(Math.random() * 40),
      avg_confidence: 0.85 + Math.random() * 0.10
    }))
  }
}

export default {
  generateMockBreedPrediction,
  generateMockRiskAssessment,
  generateMockAdvisorResponse,
  generateMockTrendsData,
  generateMockBatchResults,
  generateMockRecommendations,
  generateMockAnalytics
}
