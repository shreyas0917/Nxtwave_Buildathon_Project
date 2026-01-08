import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './HistoricalTracking.css'

function HistoricalTracking() {
  const { t } = useTranslation()
  const [animalId, setAnimalId] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  // Sample historical data (in production, fetch from API)
  const sampleHistory = [
    { date: '2024-01-01', risk_level: 'Low', confidence: 0.85, breed: 'Gir' },
    { date: '2024-01-08', risk_level: 'Low', confidence: 0.82, breed: 'Gir' },
    { date: '2024-01-15', risk_level: 'Medium', confidence: 0.75, breed: 'Gir' },
    { date: '2024-01-22', risk_level: 'Low', confidence: 0.88, breed: 'Gir' },
    { date: '2024-01-29', risk_level: 'Low', confidence: 0.90, breed: 'Gir' }
  ]

  useEffect(() => {
    if (animalId) {
      // In production, fetch from API
      setHistory(sampleHistory)
    }
  }, [animalId])

  return (
    <div className="historical-tracking">
      <h1>{t('history.title', 'Historical Health Tracking')}</h1>
      <p className="page-description">
        {t('history.description', 'Track health history and trends for individual animals')}
      </p>

      <div className="tracking-container">
        <div className="search-section">
          <input
            type="text"
            value={animalId}
            onChange={(e) => setAnimalId(e.target.value)}
            placeholder={t('history.search_placeholder', 'Enter Animal ID')}
            className="input"
          />
        </div>

        {history.length > 0 && (
          <div className="history-chart">
            <h2>{t('history.chart.title', 'Health Trend Over Time')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="confidence" stroke="#6ba644" strokeWidth={2} name="Confidence" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoricalTracking

