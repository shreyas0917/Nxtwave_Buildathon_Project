import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './LanguageSelector'
import './Header.css'

function Header() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🐄</span>
          <span className="logo-text">{t('app.name')}</span>
        </Link>
        
        <nav className="nav">
          <Link 
            to="/breed" 
            className={location.pathname === '/breed' ? 'nav-link active' : 'nav-link'}
          >
            {t('nav.breed')}
          </Link>
          <Link 
            to="/risk" 
            className={location.pathname === '/risk' ? 'nav-link active' : 'nav-link'}
          >
            {t('nav.risk')}
          </Link>
          <Link 
            to="/advisor" 
            className={location.pathname === '/advisor' ? 'nav-link active' : 'nav-link'}
          >
            {t('nav.advisor')}
          </Link>
          <Link 
            to="/trends" 
            className={location.pathname === '/trends' ? 'nav-link active' : 'nav-link'}
          >
            {t('nav.trends')}
          </Link>
          <Link 
            to="/batch" 
            className={location.pathname === '/batch' ? 'nav-link active' : 'nav-link'}
            title={t('nav.batch', 'Batch Processing')}
          >
            📦
          </Link>
          <Link 
            to="/recommendations" 
            className={location.pathname === '/recommendations' ? 'nav-link active' : 'nav-link'}
            title={t('nav.recommendations', 'Recommendations')}
          >
            💡
          </Link>
        </nav>

        <LanguageSelector />
      </div>
    </header>
  )
}

export default Header

