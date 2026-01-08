import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { qrcodeAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import './QRCodeGenerator.css'

function QRCodeGenerator() {
  const { t } = useTranslation()
  const [animalId, setAnimalId] = useState('')
  const [breed, setBreed] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!animalId.trim()) {
      setError('Please enter an Animal ID')
      return
    }

    setLoading(true)
    setError(null)
    setQrCodeUrl(null)

    try {
      const url = await qrcodeAPI.generateQR(animalId, breed || null)
      setQrCodeUrl(url)
    } catch (err) {
      setError(err.message || 'Failed to generate QR code')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.href = qrCodeUrl
      link.download = `qr_${animalId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="qr-generator">
      <h1>{t('qrcode.title', 'QR Code Generator')}</h1>
      <p className="page-description">
        {t('qrcode.description', 'Generate QR codes for animal tracking and quick access')}
      </p>

      <div className="qr-container">
        <div className="qr-form">
          <h2>{t('qrcode.form.title', 'Generate QR Code')}</h2>
          
          <div className="form-group">
            <label>{t('qrcode.form.animal_id', 'Animal ID')} *</label>
            <input
              type="text"
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              placeholder={t('qrcode.form.animal_id_placeholder', 'e.g., ANI-001')}
              className="input"
            />
          </div>

          <div className="form-group">
            <label>{t('qrcode.form.breed', 'Breed (Optional)')}</label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder={t('qrcode.form.breed_placeholder', 'e.g., Gir, Murrah')}
              className="input"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !animalId.trim()}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <LoadingSpinner /> {t('qrcode.generating', 'Generating...')}
              </>
            ) : (
              t('qrcode.generate', 'Generate QR Code')
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {qrCodeUrl && (
          <div className="qr-result">
            <h2>{t('qrcode.result.title', 'QR Code Generated')}</h2>
            <div className="qr-display">
              <img src={qrCodeUrl} alt="QR Code" className="qr-image" />
              <div className="qr-info">
                <p><strong>{t('qrcode.result.animal_id', 'Animal ID')}:</strong> {animalId}</p>
                {breed && <p><strong>{t('qrcode.result.breed', 'Breed')}:</strong> {breed}</p>}
                <p className="qr-note">
                  {t('qrcode.result.note', 'Scan this QR code to quickly access animal information')}
                </p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="btn btn-primary btn-download"
            >
              📥 {t('qrcode.download', 'Download QR Code')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QRCodeGenerator

