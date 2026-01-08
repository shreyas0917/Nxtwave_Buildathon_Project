import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Home.css'

function Home() {
  const { t } = useTranslation()

  return (
    <div className="home">
      <div className="hero">
        <h1>{t('home.title')}</h1>
        <p className="hero-subtitle">{t('home.subtitle')}</p>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h2>{t('home.features.breed.title')}</h2>
          <p>{t('home.features.breed.description')}</p>
          <Link to="/breed" className="feature-link">
            {t('home.features.breed.action')} →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚠️</div>
          <h2>{t('home.features.risk.title')}</h2>
          <p>{t('home.features.risk.description')}</p>
          <Link to="/risk" className="feature-link">
            {t('home.features.risk.action')} →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <h2>{t('home.features.advisor.title')}</h2>
          <p>{t('home.features.advisor.description')}</p>
          <Link to="/advisor" className="feature-link">
            {t('home.features.advisor.action')} →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h2>{t('home.features.trends.title', 'Health Trends')}</h2>
          <p>{t('home.features.trends.description', 'View regional health trends and analytics')}</p>
          <Link to="/trends" className="feature-link">
            {t('home.features.trends.action', 'View Trends')} →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h2>{t('home.features.batch.title', 'Batch Processing')}</h2>
          <p>{t('home.features.batch.description', 'Process multiple animals at once for herd management')}</p>
          <Link to="/batch" className="feature-link">
            {t('home.features.batch.action', 'Batch Process')} →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💡</div>
          <h2>{t('home.features.recommendations.title', 'AI Recommendations')}</h2>
          <p>{t('home.features.recommendations.description', 'Get personalized care recommendations')}</p>
          <Link to="/recommendations" className="feature-link">
            {t('home.features.recommendations.action', 'Get Recommendations')} →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h2>{t('home.features.reports.title', 'Health Reports')}</h2>
          <p>{t('home.features.reports.description', 'Generate comprehensive PDF health reports')}</p>
          <Link to="/reports" className="feature-link">
            {t('home.features.reports.action', 'Generate Report')} →
          </Link>
        </div>
      </div>

      <div className="trust-section">
        <h2>{t('home.trust.title')}</h2>
        <p>{t('home.trust.description')}</p>
        <div className="trust-factors">
          <div className="trust-factor">
            <strong>30%</strong> Model Confidence
          </div>
          <div className="trust-factor">
            <strong>40%</strong> Regional Validity
          </div>
          <div className="trust-factor">
            <strong>30%</strong> Community Feedback
          </div>
        </div>
      </div>

      <div className="disclaimer-box">
        <h3>⚠️ Important Disclaimer</h3>
        <p>
          This is a <strong>NON-DIAGNOSTIC</strong> tool. This does <strong>NOT</strong> replace 
          veterinary consultation. Always consult a qualified veterinarian for medical diagnosis 
          and treatment decisions.
        </p>
      </div>
    </div>
  )
}

export default Home

