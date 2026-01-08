import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { recommendationsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { livestockBreeds } from '../data/breeds'
import { stateList, getDistrictsByState } from '../data/indianStates'
import './Recommendations.css'

function Recommendations() {
  const { t } = useTranslation()
  const [breed, setBreed] = useState('')
  const [riskLevel, setRiskLevel] = useState('Low')
  const [visualCues, setVisualCues] = useState([])
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const visualCueOptions = [
    'Body Condition Score',
    'Coat Quality',
    'Eye/Nose Discharge'
  ]

  const toggleVisualCue = (cue) => {
    if (visualCues.includes(cue)) {
      setVisualCues(visualCues.filter(c => c !== cue))
    } else {
      setVisualCues([...visualCues, cue])
    }
  }

  const handleGetRecommendations = async () => {
    if (!riskLevel) {
      setError('Please select a risk level')
      return
    }

    setLoading(true)
    setError(null)
    setRecommendations(null)

    try {
      const region = district || state || null
      const result = await recommendationsAPI.getRecommendations({
        breed: breed || null,
        risk_level: riskLevel,
        visual_cues: visualCues,
        region: region
      })
      setRecommendations(result)
    } catch (err) {
      setError(err.message || 'Failed to get recommendations')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ef4444'
      case 'Medium':
        return '#f59e0b'
      case 'Low':
        return '#10b981'
      default:
        return '#6b7280'
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Medical': '🏥',
      'Nutrition': '🥗',
      'Grooming': '✂️',
      'Monitoring': '👁️',
      'Preventive': '🛡️',
      'Seasonal': '🌤️',
      'Breed-Specific': '🐄',
      'General': '📋',
      'Health': '💊'
    }
    return icons[category] || '📌'
  }

  return (
    <div className="recommendations">
      <h1>{t('recommendations.title', 'AI-Powered Care Recommendations')}</h1>
      <p className="page-description">
        {t('recommendations.description', 'Get personalized care recommendations based on your animal\'s health status')}
      </p>

      <div className="recommendations-container">
        <div className="input-section">
          <h2>{t('recommendations.input.title', 'Animal Information')}</h2>
          
          <div className="form-group">
            <label>{t('recommendations.input.breed', 'Breed (Optional)')}</label>
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="input"
            >
              <option value="">Select Breed</option>
              {livestockBreeds.map((breedOption) => (
                <option key={breedOption} value={breedOption}>
                  {breedOption}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t('recommendations.input.risk', 'Risk Level')} *</label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="input"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t('recommendations.input.visual_cues', 'Visual Cues Detected')}</label>
            <div className="checkbox-group">
              {visualCueOptions.map(cue => (
                <label key={cue} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={visualCues.includes(cue)}
                    onChange={() => toggleVisualCue(cue)}
                  />
                  <span>{cue}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>State (Optional)</label>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value)
                setDistrict('')
              }}
              className="input"
            >
              <option value="">Select State</option>
              {stateList.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>District (Optional)</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="input"
              disabled={!state}
            >
              <option value="">{state ? 'Select District' : 'Select State First'}</option>
              {state && getDistrictsByState(state).map((districtName) => (
                <option key={districtName} value={districtName}>
                  {districtName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGetRecommendations}
            disabled={loading || !riskLevel}
            className="btn btn-primary btn-get-recommendations"
          >
            {loading ? (
              <>
                <LoadingSpinner /> {t('recommendations.loading', 'Generating...')}
              </>
            ) : (
              t('recommendations.get', 'Get Recommendations')
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {recommendations && (
          <div className="results-section">
            <div className="priority-banner" style={{ backgroundColor: getPriorityColor(recommendations.priority) + '20', borderColor: getPriorityColor(recommendations.priority) }}>
              <div className="priority-info">
                <span className="priority-label" style={{ color: getPriorityColor(recommendations.priority) }}>
                  Priority: {recommendations.priority}
                </span>
                <span className="impact-text">{recommendations.estimated_impact}</span>
              </div>
            </div>

            <h2>{t('recommendations.results.title', 'Recommendations')}</h2>
            <div className="recommendations-list">
              {recommendations.recommendations.map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <div className="recommendation-header">
                    <span className="category-badge">
                      {getCategoryIcon(rec.category)} {rec.category}
                    </span>
                    <span 
                      className="priority-badge"
                      style={{ 
                        backgroundColor: getPriorityColor(rec.priority) + '20',
                        color: getPriorityColor(rec.priority)
                      }}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <h3>{rec.title}</h3>
                  <p>{rec.description}</p>
                  <div className="impact-badge">
                    Impact: {rec.estimated_impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Recommendations

