import React from 'react'
import './TrustMeter.css'

function TrustMeter({ confidence, trustScore, regionalValidity }) {
  const getTrustColor = (score) => {
    if (score >= 0.7) return 'var(--success-color)'
    if (score >= 0.5) return 'var(--warning-color)'
    return 'var(--danger-color)'
  }

  const getTrustLabel = (score) => {
    if (score >= 0.7) return 'High Trust'
    if (score >= 0.5) return 'Moderate Trust'
    return 'Low Trust'
  }

  return (
    <div className="trust-meter">
      <h4>Trust Score</h4>
      <div className="trust-breakdown">
        <div className="trust-bar-container">
          <div className="trust-bar-label">
            <span>Overall Trust</span>
            <span className="trust-value" style={{ color: getTrustColor(trustScore) }}>
              {Math.round(trustScore * 100)}% - {getTrustLabel(trustScore)}
            </span>
          </div>
          <div className="trust-bar">
            <div
              className="trust-bar-fill"
              style={{
                width: `${trustScore * 100}%`,
                backgroundColor: getTrustColor(trustScore)
              }}
            />
          </div>
        </div>

        <div className="trust-components">
          <div className="trust-component">
            <span>Model Confidence</span>
            <span>{Math.round(confidence * 100)}%</span>
          </div>
          {regionalValidity !== undefined && (
            <div className="trust-component">
              <span>Regional Validity</span>
              <span>{Math.round(regionalValidity * 100)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrustMeter

