import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { comparisonAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { livestockBreeds } from '../data/breeds'
import { stateList } from '../data/indianStates'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Comparison.css'

function Comparison() {
  const { t } = useTranslation()
  const [comparisonType, setComparisonType] = useState('breed')
  const [items, setItems] = useState([])
  const [period, setPeriod] = useState('last_30_days')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const breedOptions = livestockBreeds.filter(b => b !== 'Unknown/Mixed')
  const periodOptions = ['last_7_days', 'last_30_days', 'last_90_days']
  const regionOptions = stateList

  const handleItemToggle = (item) => {
    if (items.includes(item)) {
      setItems(items.filter(i => i !== item))
    } else {
      setItems([...items, item])
    }
  }

  const handleCompare = async () => {
    if (items.length < 2) {
      setError('Please select at least 2 items to compare')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const result = await comparisonAPI.compare(comparisonType, items, period)
      setResults(result)
    } catch (err) {
      setError(err.message || 'Failed to perform comparison')
    } finally {
      setLoading(false)
    }
  }

  const getAvailableOptions = () => {
    switch (comparisonType) {
      case 'breed':
        return breedOptions
      case 'time':
        return periodOptions
      case 'region':
        return regionOptions
      default:
        return []
    }
  }

  return (
    <div className="comparison">
      <h1>{t('comparison.title', 'Comparison Analysis')}</h1>
      <p className="page-description">
        {t('comparison.description', 'Compare breeds, time periods, or regions for insights')}
      </p>

      <div className="comparison-container">
        <div className="comparison-controls">
          <div className="control-group">
            <label>{t('comparison.type', 'Comparison Type')}</label>
            <select
              value={comparisonType}
              onChange={(e) => {
                setComparisonType(e.target.value)
                setItems([])
              }}
              className="input"
            >
              <option value="breed">{t('comparison.type.breed', 'Compare Breeds')}</option>
              <option value="time">{t('comparison.type.time', 'Compare Time Periods')}</option>
              <option value="region">{t('comparison.type.region', 'Compare Regions')}</option>
            </select>
          </div>

          <div className="control-group">
            <label>{t('comparison.period', 'Time Period')}</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input"
            >
              <option value="last_7_days">{t('trends.period.7days', 'Last 7 Days')}</option>
              <option value="last_30_days">{t('trends.period.30days', 'Last 30 Days')}</option>
              <option value="last_90_days">{t('trends.period.90days', 'Last 90 Days')}</option>
            </select>
          </div>

          <div className="control-group">
            <label>{t('comparison.items', 'Select Items to Compare')} (Min 2)</label>
            <div className="items-grid" style={{ 
              maxHeight: '200px', 
              overflowY: 'auto', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '12px',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              {getAvailableOptions().map(option => (
                <label key={option} className="checkbox-item" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '8px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}>
                  <input
                    type="checkbox"
                    checked={items.includes(option)}
                    onChange={() => handleItemToggle(option)}
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <small style={{ display: 'block', marginTop: '8px', color: 'var(--text-secondary)' }}>
              Select at least 2 items to compare
            </small>
          </div>

          <button
            onClick={handleCompare}
            disabled={loading || items.length < 2}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <LoadingSpinner /> {t('comparison.comparing', 'Comparing...')}
              </>
            ) : (
              t('comparison.compare', 'Compare')
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {results && (
          <div className="comparison-results">
            <h2>{t('comparison.results.title', 'Comparison Results')}</h2>
            
            {results.insights && results.insights.length > 0 && (
              <div className="insights-box">
                <h3>{t('comparison.insights', 'Key Insights')}</h3>
                <ul>
                  {results.insights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.items && results.items.length > 0 && (
              <div className="chart-section">
                <h3>{t('comparison.chart.title', 'Visual Comparison')}</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={results.items}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="low_risk_pct" fill="#10b981" name="Low Risk %" />
                    <Bar dataKey="medium_risk_pct" fill="#f59e0b" name="Medium Risk %" />
                    <Bar dataKey="high_risk_pct" fill="#ef4444" name="High Risk %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {results.items && (
              <div className="comparison-table">
                <h3>{t('comparison.table.title', 'Detailed Comparison')}</h3>
                <table>
                  <thead>
                    <tr>
                      <th>{t('comparison.table.item', 'Item')}</th>
                      <th>{t('comparison.table.total', 'Total Assessments')}</th>
                      <th>{t('comparison.table.low', 'Low Risk %')}</th>
                      <th>{t('comparison.table.medium', 'Medium Risk %')}</th>
                      <th>{t('comparison.table.high', 'High Risk %')}</th>
                      {results.items[0]?.avg_confidence && (
                        <th>{t('comparison.table.confidence', 'Avg Confidence')}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {results.items.map((item, idx) => (
                      <tr key={idx}>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.total_assessments?.toLocaleString() || 0}</td>
                        <td style={{ color: '#10b981' }}>{item.low_risk_pct?.toFixed(1) || 0}%</td>
                        <td style={{ color: '#f59e0b' }}>{item.medium_risk_pct?.toFixed(1) || 0}%</td>
                        <td style={{ color: '#ef4444' }}>{item.high_risk_pct?.toFixed(1) || 0}%</td>
                        {item.avg_confidence && (
                          <td>{(item.avg_confidence * 100).toFixed(1)}%</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Comparison

