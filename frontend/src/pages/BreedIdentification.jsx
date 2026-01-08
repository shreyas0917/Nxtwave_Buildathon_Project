import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Webcam from 'react-webcam'
import { breedAPI } from '../services/api'
import TrustMeter from '../components/TrustMeter'
import LoadingSpinner from '../components/LoadingSpinner'
import { stateList, getDistrictsByState } from '../data/indianStates'
import './BreedIdentification.css'

function BreedIdentification() {
  const { t } = useTranslation()
  const [image, setImage] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
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

  const predictBreed = async () => {
    if (!image) return

    setLoading(true)
    setError(null)

    try {
      // Convert base64 to blob for API
      const base64Data = image.split(',')[1]
      const region = district || state || ''
      const result = await breedAPI.predictBreed(base64Data, region)
      setPrediction(result)
    } catch (err) {
      setError(err.message || 'Failed to predict breed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="breed-identification">
      <h1>{t('breed.title')}</h1>
      <p className="page-description">{t('breed.description')}</p>

      <div className="breed-container">
        <div className="camera-section">
          <h2>{t('breed.capture.title')}</h2>
          
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
              {t('breed.capture.button')}
            </button>
            <label className="btn btn-secondary">
              {t('breed.upload.button')}
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
              <h3>{t('breed.preview.title')}</h3>
              <img src={image} alt="Preview" className="preview-image" />
              
              <div className="region-input">
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
                onClick={predictBreed}
                disabled={loading}
                className="btn btn-primary btn-large"
              >
                {loading ? <LoadingSpinner /> : t('breed.predict.button')}
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
            <h2>{t('breed.result.title')}</h2>
            
            <div className="result-card">
              <div className="result-header">
                <h3>{prediction.breed}</h3>
                <span className="confidence-badge">
                  {Math.round(prediction.confidence * 100)}% confidence
                </span>
              </div>

              <TrustMeter
                confidence={prediction.confidence}
                trustScore={prediction.trust_score}
                regionalValidity={prediction.regional_validity}
              />

              <p className="explanation">{prediction.explanation}</p>

              {prediction.grad_cam_heatmap ? (
                <div className="gradcam-section">
                  <h4>{t('breed.gradcam.title')}</h4>
                  <img
                    src={prediction.grad_cam_heatmap}
                    alt="Grad-CAM heatmap"
                    className="gradcam-image"
                    onError={(e) => {
                      console.error('Failed to load heatmap image:', e);
                      e.target.style.display = 'none';
                    }}
                  />
                  <p className="gradcam-description">
                    {t('breed.gradcam.description')}
                  </p>
                </div>
              ) : (
                <div className="gradcam-section">
                  <h4>{t('breed.gradcam.title')}</h4>
                  <p className="gradcam-description" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    Heatmap generation in progress...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BreedIdentification

