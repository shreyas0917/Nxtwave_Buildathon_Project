import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Webcam from 'react-webcam'
import { riskAPI } from '../services/api'
import TrustMeter from '../components/TrustMeter'
import LoadingSpinner from '../components/LoadingSpinner'
import { livestockBreeds } from '../data/breeds'
import { stateList, getDistrictsByState } from '../data/indianStates'
import './RiskAssessment.css'

function RiskAssessment() {
  const { t } = useTranslation()
  const [image, setImage] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [breed, setBreed] = useState('')
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')

  const webcamRef = React.useRef(null)

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setImage(imageSrc)
      setPrediction(null)
      setError(null)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
        setPrediction(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const assessRisk = async () => {
    if (!image) return

    setLoading(true)
    setError(null)

    try {
      const base64Data = image.split(',')[1]
      const region = district || state || ''
      const result = await riskAPI.assessRisk(base64Data, breed, region)
      setPrediction(result)
      
      // Trigger notification for high risk
      if (result.risk_level === 'High') {
        window.dispatchEvent(new CustomEvent('high-risk-detected', {
          detail: { risk_level: result.risk_level, confidence: result.confidence }
        }))
      }
    } catch (err) {
      setError(err.message || 'Failed to assess risk')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low':
        return 'var(--success-color)'
      case 'Medium':
        return 'var(--warning-color)'
      case 'High':
        return 'var(--danger-color)'
      default:
        return 'var(--text-secondary)'
    }
  }

  return (
    <div className="risk-assessment">
      <h1>{t('risk.title')}</h1>
      <p className="page-description">{t('risk.description')}</p>

      <div className="disclaimer-banner">
        <strong>⚠️ NON-DIAGNOSTIC TOOL:</strong> This does NOT replace veterinary consultation. 
        Always consult a qualified veterinarian for medical diagnosis and treatment.
      </div>

      <div className="risk-container">
        <div className="camera-section">
          <h2>{t('risk.capture.title')}</h2>
          
          <div className="webcam-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam"
            />
          </div>

          <div className="camera-controls">
            <button onClick={captureImage} className="btn btn-primary">
              {t('risk.capture.button')}
            </button>
            <label className="btn btn-secondary">
              {t('risk.upload.button')}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {image && (
            <div className="preview-section">
              <h3>{t('risk.preview.title')}</h3>
              <img src={image} alt="Preview" className="preview-image" />
              
              <div className="form-inputs">
                <div className="input-group">
                  <label>{t('risk.breed.label')} (Optional)</label>
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
                <div className="input-group">
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
                <div className="input-group">
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
              </div>

              <button
                onClick={assessRisk}
                disabled={loading}
                className="btn btn-primary btn-large"
              >
                {loading ? <LoadingSpinner /> : t('risk.assess.button')}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {prediction && (
          <div className="prediction-result">
            <h2>{t('risk.result.title')}</h2>
            
            <div className="result-card">
              <div className="risk-level-header">
                <h3 style={{ color: getRiskColor(prediction.risk_level) }}>
                  {prediction.risk_level} Risk
                </h3>
                <span className="confidence-badge">
                  {Math.round(prediction.confidence * 100)}% confidence
                </span>
              </div>

              <TrustMeter
                confidence={prediction.confidence}
                trustScore={prediction.trust_score}
                regionalValidity={1.0}
              />

              <div className="visual-cues">
                <h4>{t('risk.cues.title')}</h4>
                {prediction.visual_cues.map((cue, idx) => (
                  <div key={idx} className="cue-item">
                    <div className="cue-header">
                      <span className="cue-name">{cue.cue_name}</span>
                      <span className={`cue-status ${cue.detected ? 'detected' : 'normal'}`}>
                        {cue.detected ? '⚠️' : '✓'}
                      </span>
                    </div>
                    <p className="cue-description">{cue.description}</p>
                    <div className="cue-confidence">
                      Confidence: {Math.round(cue.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>

              <div className="risk-factors">
                <h4>{t('risk.factors.title')}</h4>
                <ul>
                  {prediction.factors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>

              <p className="explanation">{prediction.explanation}</p>

              {prediction.grad_cam_heatmap && (
                <div className="gradcam-section">
                  <h4>{t('risk.gradcam.title')}</h4>
                  <img
                    src={prediction.grad_cam_heatmap}
                    alt="Grad-CAM heatmap"
                    className="gradcam-image"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RiskAssessment

