import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { advisorAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import './Advisor.css'

function Advisor() {
  const { t } = useTranslation()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError(null)

    try {
      const result = await advisorAPI.askAdvisor(question)
      setAnswer(result)
    } catch (err) {
      setError(err.message || 'Failed to get answer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="advisor">
      <h1>{t('advisor.title')}</h1>
      <p className="page-description">{t('advisor.description')}</p>

      <div className="disclaimer-banner">
        <strong>⚠️ GENERAL GUIDANCE ONLY:</strong> This does NOT constitute medical diagnosis 
        or treatment. Always consult a qualified veterinarian for medical decisions.
      </div>

      <div className="advisor-container">
        <form onSubmit={handleSubmit} className="question-form">
          <div className="form-group">
            <label htmlFor="question">{t('advisor.question.label')}</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('advisor.question.placeholder')}
              className="textarea"
              rows={5}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="btn btn-primary btn-large"
          >
            {loading ? <LoadingSpinner /> : t('advisor.submit.button')}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {answer && (
          <div className="answer-section">
            <h2>{t('advisor.answer.title')}</h2>
            
            <div className="answer-card">
              <div className="answer-header">
                <span className="confidence-badge">
                  {Math.round(answer.confidence * 100)}% confidence
                </span>
              </div>

              <div className="answer-content">
                {answer.answer.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {answer.sources && answer.sources.length > 0 && (
                <div className="sources">
                  <h4>{t('advisor.sources.title')}</h4>
                  <ul>
                    {answer.sources.map((source, idx) => (
                      <li key={idx}>{source}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Advisor

