import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { trendsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { stateList, getDistrictsByState } from '../data/indianStates'
import './Trends.css'

const COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  primary: '#6ba644'
}

const CHART_COLORS = ['#6ba644', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']

function Trends() {
  const { t } = useTranslation()
  const [district, setDistrict] = useState('')
  const [state, setState] = useState('')
  const [period, setPeriod] = useState('last_30_days')
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(300000) // 5 minutes default
  const [availableDistricts, setAvailableDistricts] = useState([])

  // Update districts when state changes
  useEffect(() => {
    if (state) {
      const districts = getDistrictsByState(state)
      setAvailableDistricts(districts)
      // Reset district if it's not in the new state's districts
      if (district && !districts.includes(district)) {
        setDistrict('')
      }
    } else {
      setAvailableDistricts([])
      setDistrict('')
    }
  }, [state, district])

  const fetchTrends = async () => {
    setLoading(true)
    setError(null)

    try {
      // Only send non-empty values
      const districtParam = district.trim() || null
      const stateParam = state.trim() || null
      
      const result = await trendsAPI.getTrends(districtParam, stateParam, period)
      setTrends(result)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message || 'Failed to fetch trends')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchTrends()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchTrends()
    }, refreshInterval)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, refreshInterval])

  // Refresh when period changes
  useEffect(() => {
    if (trends) { // Only refresh if we already have data (not on initial load)
      fetchTrends()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  const formatDate = (dateStr) => {
    try {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div className="trends">
      <h1>{t('trends.title')}</h1>
      <p className="page-description">{t('trends.description')}</p>

      <div className="trends-container">
        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-info">
            {lastUpdated && (
              <span className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
                {trends?.last_updated && ` (Server: ${new Date(trends.last_updated).toLocaleTimeString()})`}
              </span>
            )}
            {autoRefresh && (
              <span className="auto-refresh-indicator">
                🔄 Auto-refreshing every {refreshInterval / 60000} minutes
              </span>
            )}
          </div>
          <div className="refresh-controls">
            <label className="auto-refresh-toggle">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span>Auto-refresh</span>
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="refresh-interval-select"
              disabled={!autoRefresh}
            >
              <option value={60000}>Every 1 minute</option>
              <option value={300000}>Every 5 minutes</option>
              <option value={600000}>Every 10 minutes</option>
              <option value={1800000}>Every 30 minutes</option>
            </select>
            <button
              onClick={fetchTrends}
              disabled={loading}
              className="btn btn-secondary btn-refresh"
              title="Refresh now"
            >
              {loading ? <LoadingSpinner /> : '🔄 Refresh'}
            </button>
          </div>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>{t('trends.state.label')} *</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="input select-input"
            >
              <option value="">Select State</option>
              {stateList.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t('trends.district.label')}</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="input select-input"
              disabled={!state}
            >
              <option value="">{state ? 'Select District' : 'Select State First'}</option>
              {availableDistricts.map((districtName) => (
                <option key={districtName} value={districtName}>
                  {districtName}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t('trends.period.label')}</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input select-input"
            >
              <option value="last_7_days">{t('trends.period.7days')}</option>
              <option value="last_30_days">{t('trends.period.30days')}</option>
              <option value="last_90_days">Last 90 Days</option>
            </select>
          </div>

          <button onClick={fetchTrends} disabled={loading} className="btn btn-primary">
            {loading ? <LoadingSpinner /> : t('trends.fetch.button')}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
            <button 
              onClick={fetchTrends} 
              className="btn btn-secondary"
              style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              Retry
            </button>
          </div>
        )}

        {loading && !trends && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <LoadingSpinner />
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Loading health trends data...
            </p>
          </div>
        )}

        {trends && trends.summary && (
          <>
            {/* Location Info */}
            <div className="location-info">
              <h3>
                📍 {trends.district !== "All Districts" ? trends.district : ""} 
                {trends.district !== "All Districts" && trends.state !== "All States" ? ", " : ""}
                {trends.state !== "All States" ? trends.state : "All Regions"}
                {trends.district === "All Districts" && trends.state === "All States" ? " - " : " - "}
                {period.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h3>
              {trends.disclaimer && (
                <p className="location-disclaimer">{trends.disclaimer}</p>
              )}
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <div className="card-value">{(trends.summary.total_assessments || 0).toLocaleString()}</div>
                  <div className="card-label">Total Assessments</div>
                </div>
              </div>
              <div className="summary-card success">
                <div className="card-icon">✅</div>
                <div className="card-content">
                  <div className="card-value">{((trends.summary.low_risk_percentage || 0)).toFixed(1)}%</div>
                  <div className="card-label">Low Risk</div>
                  <div className="card-subvalue">{trends.summary.low_risk_count || 0} cases</div>
                </div>
              </div>
              <div className="summary-card warning">
                <div className="card-icon">⚠️</div>
                <div className="card-content">
                  <div className="card-value">{((trends.summary.medium_risk_percentage || 0)).toFixed(1)}%</div>
                  <div className="card-label">Medium Risk</div>
                  <div className="card-subvalue">{trends.summary.medium_risk_count || 0} cases</div>
                </div>
              </div>
              <div className="summary-card danger">
                <div className="card-icon">🔴</div>
                <div className="card-content">
                  <div className="card-value">{((trends.summary.high_risk_percentage || 0)).toFixed(1)}%</div>
                  <div className="card-label">High Risk</div>
                  <div className="card-subvalue">{trends.summary.high_risk_count || 0} cases</div>
                </div>
              </div>
              <div className="summary-card info">
                <div className="card-icon">🎯</div>
                <div className="card-content">
                  <div className="card-value">{((trends.summary.average_confidence || 0) * 100).toFixed(1)}%</div>
                  <div className="card-label">Avg Confidence</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab ${activeTab === 'time-series' ? 'active' : ''}`}
                onClick={() => setActiveTab('time-series')}
              >
                Time Series
              </button>
              <button
                className={`tab ${activeTab === 'breeds' ? 'active' : ''}`}
                onClick={() => setActiveTab('breeds')}
              >
                Breed Analysis
              </button>
              <button
                className={`tab ${activeTab === 'visual-cues' ? 'active' : ''}`}
                onClick={() => setActiveTab('visual-cues')}
              >
                Visual Cues
              </button>
              {trends.regional_comparison && (
                <button
                  className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
                  onClick={() => setActiveTab('comparison')}
                >
                  Regional Comparison
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="charts-grid">
                  {/* Risk Distribution Pie Chart */}
                  <div className="chart-card">
                    <h3>Risk Level Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Low Risk', value: trends.summary.low_risk_count || 0 },
                            { name: 'Medium Risk', value: trends.summary.medium_risk_count || 0 },
                            { name: 'High Risk', value: trends.summary.high_risk_count || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Low Risk', value: trends.summary.low_risk_count || 0 },
                            { name: 'Medium Risk', value: trends.summary.medium_risk_count || 0 },
                            { name: 'High Risk', value: trends.summary.high_risk_count || 0 }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={[COLORS.low, COLORS.medium, COLORS.high][index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Time Series Overview */}
                  {trends.time_series && trends.time_series.length > 0 && (
                    <div className="chart-card">
                      <h3>Risk Trends Over Time</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trends.time_series.slice(-14)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tickFormatter={formatDate} />
                          <YAxis />
                          <Tooltip labelFormatter={(label) => formatDate(label)} />
                          <Legend />
                          <Area type="monotone" dataKey="low_risk" stackId="1" stroke={COLORS.low} fill={COLORS.low} fillOpacity={0.6} />
                          <Area type="monotone" dataKey="medium_risk" stackId="1" stroke={COLORS.medium} fill={COLORS.medium} fillOpacity={0.6} />
                          <Area type="monotone" dataKey="high_risk" stackId="1" stroke={COLORS.high} fill={COLORS.high} fillOpacity={0.6} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'time-series' && trends.time_series && trends.time_series.length > 0 && (
                <div className="charts-grid">
                  <div className="chart-card full-width">
                    <h3>Daily Risk Assessment Trends</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={trends.time_series}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={formatDate} />
                        <YAxis />
                        <Tooltip labelFormatter={(label) => formatDate(label)} />
                        <Legend />
                        <Line type="monotone" dataKey="low_risk" stroke={COLORS.low} strokeWidth={2} name="Low Risk" />
                        <Line type="monotone" dataKey="medium_risk" stroke={COLORS.medium} strokeWidth={2} name="Medium Risk" />
                        <Line type="monotone" dataKey="high_risk" stroke={COLORS.high} strokeWidth={2} name="High Risk" />
                        <Line type="monotone" dataKey="total" stroke={COLORS.primary} strokeWidth={2} strokeDasharray="5 5" name="Total" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-card full-width">
                    <h3>Average Confidence Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={trends.time_series}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={formatDate} />
                        <YAxis domain={[0, 1]} />
                        <Tooltip 
                          labelFormatter={(label) => formatDate(label)}
                          formatter={(value) => `${(value * 100).toFixed(1)}%`}
                        />
                        <Area type="monotone" dataKey="avg_confidence" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'breeds' && trends.breed_trends && trends.breed_trends.length > 0 && (
                <div className="charts-grid">
                  <div className="chart-card full-width">
                    <h3>Breed-Specific Risk Distribution ({trends.breed_trends.length} Breeds)</h3>
                    <ResponsiveContainer width="100%" height={Math.max(400, trends.breed_trends.length * 30)}>
                      <BarChart data={trends.breed_trends} layout="vertical" margin={{ left: 100, right: 20, top: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="breed" type="category" width={120} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="low_risk_count" stackId="a" fill={COLORS.low} name="Low Risk" />
                        <Bar dataKey="medium_risk_count" stackId="a" fill={COLORS.medium} name="Medium Risk" />
                        <Bar dataKey="high_risk_count" stackId="a" fill={COLORS.high} name="High Risk" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-card full-width">
                    <h3>Breed Assessment Counts (All {trends.breed_trends.length} Breeds)</h3>
                    <ResponsiveContainer width="100%" height={Math.max(300, trends.breed_trends.length * 25)}>
                      <BarChart data={trends.breed_trends} margin={{ bottom: 120 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="breed" 
                          angle={-45} 
                          textAnchor="end" 
                          height={Math.min(150, trends.breed_trends.length * 8)}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total_assessments" fill={COLORS.primary} name="Total Assessments" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Breed Summary Table */}
                  <div className="chart-card full-width">
                    <h3>Breed Summary Table</h3>
                    <div className="breed-table-container">
                      <table className="breed-table">
                        <thead>
                          <tr>
                            <th>Breed</th>
                            <th>Total Assessments</th>
                            <th>Low Risk</th>
                            <th>Medium Risk</th>
                            <th>High Risk</th>
                            <th>Avg Confidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trends.breed_trends.map((breed, idx) => (
                            <tr key={idx}>
                              <td><strong>{breed.breed}</strong></td>
                              <td>{breed.total_assessments}</td>
                              <td style={{ color: COLORS.low }}>{breed.low_risk_count}</td>
                              <td style={{ color: COLORS.medium }}>{breed.medium_risk_count}</td>
                              <td style={{ color: COLORS.high }}>{breed.high_risk_count}</td>
                              <td>{(breed.average_confidence * 100).toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'visual-cues' && trends.visual_cue_trends && trends.visual_cue_trends.length > 0 && (
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>Visual Cue Detection Rates</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={trends.visual_cue_trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cue_name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
                        <Bar dataKey="detection_rate" fill={COLORS.primary} name="Detection Rate" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-card">
                    <h3>Visual Cue Detection Counts</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={trends.visual_cue_trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cue_name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="detected_count" fill={COLORS.high} name="Detected" />
                        <Bar dataKey="total_count" fill={COLORS.primary} name="Total" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'comparison' && trends.regional_comparison && trends.regional_comparison.current_region && (
                <div className="charts-grid">
                  <div className="chart-card full-width">
                    <h3>Regional Comparison</h3>
                    <div className="comparison-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Region</th>
                            <th>Total Assessments</th>
                            <th>Low Risk %</th>
                            <th>Medium Risk %</th>
                            <th>High Risk %</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="current-region">
                            <td><strong>Current Region</strong></td>
                            <td>{(trends.regional_comparison.current_region?.total || 0).toLocaleString()}</td>
                            <td>{(trends.regional_comparison.current_region?.low_risk_pct || 0).toFixed(1)}%</td>
                            <td>{(trends.regional_comparison.current_region?.medium_risk_pct || 0).toFixed(1)}%</td>
                            <td>{(trends.regional_comparison.current_region?.high_risk_pct || 0).toFixed(1)}%</td>
                          </tr>
                          {trends.regional_comparison.neighboring_regions && trends.regional_comparison.neighboring_regions.map((region, idx) => (
                            <tr key={idx}>
                              <td>{region.name || 'Unknown'}</td>
                              <td>{(region.total || 0).toLocaleString()}</td>
                              <td>{(region.low_risk_pct || 0).toFixed(1)}%</td>
                              <td>{(region.medium_risk_pct || 0).toFixed(1)}%</td>
                              <td>{(region.high_risk_pct || 0).toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="privacy-note">
              <p>{trends.disclaimer}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Trends
