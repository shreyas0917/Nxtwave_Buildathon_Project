import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { trendsAPI, comparisonAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { stateList, getDistrictsByState } from '../data/indianStates'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import './Analytics.css'

function Analytics() {
  const { t } = useTranslation()
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [period, setPeriod] = useState('last_30_days')
  const [trends, setTrends] = useState(null)
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [selectedState, selectedDistrict, period])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const trendsData = await trendsAPI.getTrends(
        selectedDistrict || null,
        selectedState || null,
        period
      )
      setTrends(trendsData)
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleCompare = async (type, items) => {
    try {
      const result = await comparisonAPI.compare(type, items, period)
      setComparison(result)
      setActiveView('comparison')
    } catch (err) {
      setError(err.message || 'Failed to perform comparison')
    }
  }

  return (
    <div className="analytics">
      <h1>{t('analytics.title', 'Advanced Analytics Dashboard')}</h1>
      <p className="page-description">
        {t('analytics.description', 'Comprehensive analytics and predictive insights for livestock health')}
      </p>

      <div className="analytics-container">
        <div className="analytics-filters">
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value)
              setSelectedDistrict('')
            }}
            className="input"
          >
            <option value="">{t('trends.state.placeholder', 'All States')}</option>
            {stateList.map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="input"
            disabled={!selectedState}
          >
            <option value="">{t('trends.district.placeholder', 'All Districts')}</option>
            {selectedState && getDistrictsByState(selectedState).map((districtName) => (
              <option key={districtName} value={districtName}>
                {districtName}
              </option>
            ))}
          </select>

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

        {loading && <LoadingSpinner />}
        {error && <div className="error-message">{error}</div>}

        {trends && (
          <div className="analytics-content">
            <div className="kpi-cards">
              <div className="kpi-card">
                <div className="kpi-value">{trends.summary?.total_assessments?.toLocaleString() || 0}</div>
                <div className="kpi-label">{t('analytics.kpi.total', 'Total Assessments')}</div>
              </div>
              <div className="kpi-card success">
                <div className="kpi-value">{trends.summary?.low_risk_percentage?.toFixed(1) || 0}%</div>
                <div className="kpi-label">{t('analytics.kpi.low_risk', 'Low Risk')}</div>
              </div>
              <div className="kpi-card warning">
                <div className="kpi-value">{trends.summary?.medium_risk_percentage?.toFixed(1) || 0}%</div>
                <div className="kpi-label">{t('analytics.kpi.medium_risk', 'Medium Risk')}</div>
              </div>
              <div className="kpi-card danger">
                <div className="kpi-value">{trends.summary?.high_risk_percentage?.toFixed(1) || 0}%</div>
                <div className="kpi-label">{t('analytics.kpi.high_risk', 'High Risk')}</div>
              </div>
            </div>

            <div className="charts-section">
              <h2>{t('analytics.charts.title', 'Trend Analysis')}</h2>
              {trends.time_series && trends.time_series.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={trends.time_series}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="low_risk" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="medium_risk" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="high_risk" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics

