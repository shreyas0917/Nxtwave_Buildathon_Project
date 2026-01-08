import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { reportsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { livestockBreeds } from '../data/breeds'
import './HealthReports.css'

function HealthReports() {
  const { t } = useTranslation()
  const [animalId, setAnimalId] = useState('')
  const [breed, setBreed] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerateReport = async () => {
    setLoading(true)
    setError(null)
    setReport(null)

    try {
      // Sample assessments (in real app, fetch from history)
      const assessments = [
        {
          date: new Date().toISOString(),
          risk_level: 'Low',
          confidence: 0.85,
          breed: breed || 'Gir'
        }
      ]

      const result = await reportsAPI.generateReport({
        animal_id: animalId || null,
        breed: breed || null,
        assessments: assessments
      })
      setReport(result)
    } catch (err) {
      setError(err.message || 'Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (report && report.pdf_url) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const fullUrl = `${apiUrl}${report.pdf_url}`
        
        // Try to download using fetch and create blob
        const response = await fetch(fullUrl)
        if (!response.ok) {
          throw new Error('Failed to download PDF')
        }
        
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `health_report_${report.report_id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (err) {
        setError(`Failed to download PDF: ${err.message}`)
        // Fallback to opening in new tab
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        window.open(`${apiUrl}${report.pdf_url}`, '_blank')
      }
    }
  }

  return (
    <div className="health-reports">
      <h1>{t('reports.title', 'Health Reports')}</h1>
      <p className="page-description">
        {t('reports.description', 'Generate comprehensive health reports for your animals')}
      </p>

      <div className="reports-container">
        <div className="report-form">
          <h2>{t('reports.form.title', 'Generate Report')}</h2>
          
          <div className="form-group">
            <label>{t('reports.form.animal_id', 'Animal ID (Optional)')}</label>
            <input
              type="text"
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              placeholder={t('reports.form.animal_id_placeholder', 'e.g., ANI-001')}
              className="input"
            />
          </div>

          <div className="form-group">
            <label>{t('reports.form.breed', 'Breed (Optional)')}</label>
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

          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <LoadingSpinner /> {t('reports.generating', 'Generating...')}
              </>
            ) : (
              t('reports.generate', 'Generate Report')
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {report && (
          <div className="report-result">
            <div className="report-success">
              <div className="success-icon">✓</div>
              <h2>{t('reports.success.title', 'Report Generated Successfully!')}</h2>
              <p>{t('reports.success.message', 'Your health report is ready for download')}</p>
            </div>

            <div className="report-details">
              <div className="detail-item">
                <strong>{t('reports.details.id', 'Report ID')}:</strong>
                <span>{report.report_id}</span>
              </div>
              <div className="detail-item">
                <strong>{t('reports.details.generated', 'Generated')}:</strong>
                <span>{new Date(report.generated_at).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <strong>{t('reports.details.assessments', 'Assessments')}:</strong>
                <span>{report.summary.total_assessments}</span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="btn btn-primary btn-download"
            >
              📥 {t('reports.download', 'Download PDF Report')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HealthReports

