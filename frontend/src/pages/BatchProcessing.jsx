import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { batchAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import './BatchProcessing.css'

function BatchProcessing() {
  const { t } = useTranslation()
  const [images, setImages] = useState([])
  const [animalIds, setAnimalIds] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = []
    const newIds = []

    files.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        newImages.push(event.target.result)
        newIds.push(`Animal-${index + 1}`)
        
        if (newImages.length === files.length) {
          setImages([...images, ...newImages])
          setAnimalIds([...animalIds, ...newIds])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newIds = animalIds.filter((_, i) => i !== index)
    setImages(newImages)
    setAnimalIds(newIds)
  }

  const handleProcess = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const result = await batchAPI.processBatch(images, animalIds)
      setResults(result)
      
      // Trigger notification for batch completion
      window.dispatchEvent(new CustomEvent('batch-complete', {
        detail: { count: result.success_count }
      }))
    } catch (err) {
      setError(err.message || 'Failed to process batch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="batch-processing">
      <h1>{t('batch.title', 'Batch Processing')}</h1>
      <p className="page-description">
        {t('batch.description', 'Process multiple animals at once for efficient herd management')}
      </p>

      <div className="batch-container">
        <div className="upload-section">
          <h2>{t('batch.upload.title', 'Upload Images')}</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="file-input"
            id="batch-upload"
          />
          <label htmlFor="batch-upload" className="file-input-label">
            {t('batch.upload.button', 'Select Multiple Images')}
          </label>

          {images.length > 0 && (
            <div className="image-preview-grid">
              {images.map((img, index) => (
                <div key={index} className="image-preview-item">
                  <img src={img} alt={`Animal ${index + 1}`} />
                  <button
                    onClick={() => removeImage(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                  <div className="animal-id">{animalIds[index]}</div>
                </div>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <button
              onClick={handleProcess}
              disabled={loading}
              className="btn btn-primary btn-process"
            >
              {loading ? (
                <>
                  <LoadingSpinner /> {t('batch.processing', 'Processing...')}
                </>
              ) : (
                t('batch.process', `Process ${images.length} Animals`)
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {results && (
          <div className="results-section">
            <h2>{t('batch.results.title', 'Batch Results')}</h2>
            <div className="results-summary">
              <div className="summary-stat">
                <div className="stat-value">{results.total_processed}</div>
                <div className="stat-label">{t('batch.results.total', 'Total Processed')}</div>
              </div>
              <div className="summary-stat success">
                <div className="stat-value">{results.success_count}</div>
                <div className="stat-label">{t('batch.results.success', 'Successful')}</div>
              </div>
              <div className="summary-stat error">
                <div className="stat-value">{results.error_count}</div>
                <div className="stat-label">{t('batch.results.errors', 'Errors')}</div>
              </div>
            </div>

            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('batch.table.animal', 'Animal ID')}</th>
                    <th>{t('batch.table.breed', 'Breed')}</th>
                    <th>{t('batch.table.risk', 'Risk Level')}</th>
                    <th>{t('batch.table.confidence', 'Confidence')}</th>
                    <th>{t('batch.table.status', 'Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.results.map((result, index) => (
                    <tr key={index} className={result.status === 'error' ? 'error-row' : ''}>
                      <td>{result.animal_id || `Animal-${index + 1}`}</td>
                      <td>{result.breed || 'N/A'}</td>
                      <td>
                        <span className={`risk-badge risk-${result.risk_level?.toLowerCase() || 'unknown'}`}>
                          {result.risk_level || 'N/A'}
                        </span>
                      </td>
                      <td>{(result.risk_confidence * 100).toFixed(1)}%</td>
                      <td>
                        <span className={`status-badge status-${result.status}`}>
                          {result.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BatchProcessing

