import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import OfflineIndicator from './components/OfflineIndicator'
import NotificationSystem from './components/NotificationSystem'
import Home from './pages/Home'
import BreedIdentification from './pages/BreedIdentification'
import RiskAssessment from './pages/RiskAssessment'
import Advisor from './pages/Advisor'
import Trends from './pages/Trends'
import BatchProcessing from './pages/BatchProcessing'
import Recommendations from './pages/Recommendations'
import HealthReports from './pages/HealthReports'
import Comparison from './pages/Comparison'
import QRCodeGenerator from './pages/QRCodeGenerator'
import Analytics from './pages/Analytics'
import './App.css'

function App() {
  const { t, i18n } = useTranslation()

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker
        .register('/sw/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  return (
    <Router>
      <div className="app">
        <OfflineIndicator />
        <NotificationSystem />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/breed" element={<BreedIdentification />} />
            <Route path="/risk" element={<RiskAssessment />} />
            <Route path="/advisor" element={<Advisor />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/batch" element={<BatchProcessing />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/reports" element={<HealthReports />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/qrcode" element={<QRCodeGenerator />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <div className="disclaimer">
            <strong>⚠️ {t('disclaimer.title', 'Medical Disclaimer')}:</strong> {t('disclaimer.text', 'This is a NON-DIAGNOSTIC tool. This does NOT replace veterinary consultation. Always consult a qualified veterinarian for medical diagnosis and treatment.')}
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App

