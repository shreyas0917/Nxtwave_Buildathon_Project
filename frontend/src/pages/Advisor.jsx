import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { advisorAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import './Advisor.css'

function Advisor() {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const chatEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    const userMessage = message.trim()
    setMessage('')
    setError(null)
    setLoading(true)

    // Add user message to conversation
    const userMsg = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }
    const updatedConversation = [...conversation, userMsg]
    setConversation(updatedConversation)

    try {
      // Prepare conversation history (without timestamps for API)
      const conversationHistory = conversation.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const result = await advisorAPI.chat(userMessage, conversationHistory)
      
      // Check if request was queued
      if (result.queued) {
        const assistantMsg = {
          role: 'assistant',
          content: '✅ Your message has been queued and will be answered automatically when your connection is restored.',
          timestamp: new Date().toISOString()
        }
        setConversation([...updatedConversation, assistantMsg])
        setError(null)
      } else {
        // Add assistant response to conversation
        const assistantMsg = {
          role: 'assistant',
          content: result.message,
          timestamp: new Date().toISOString(),
          sources: result.sources,
          confidence: result.confidence
        }
        setConversation([...updatedConversation, assistantMsg])
        setError(null)
      }
    } catch (err) {
      // Only show error if it's not a queued request
      if (!err.message?.includes('queued')) {
        setError(err.message || 'Failed to get response')
        // Add error message to conversation
        const errorMsg = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
          error: true
        }
        setConversation([...updatedConversation, errorMsg])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClearChat = () => {
    if (window.confirm('Clear conversation history?')) {
      setConversation([])
      setError(null)
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

      <div className="chat-container">
        {/* Chat Messages */}
        <div className="chat-messages" ref={messagesContainerRef}>
          {conversation.length === 0 ? (
            <div className="chat-welcome">
              <p>👋 Welcome! I'm your AI livestock care advisor.</p>
              <p>Ask me anything about:</p>
              <ul>
                <li>Livestock care and nutrition</li>
                <li>Health monitoring and preventive care</li>
                <li>Breed-specific guidance</li>
                <li>Regional best practices</li>
                <li>Common health concerns</li>
              </ul>
              <p><strong>Example:</strong> "How much water should my Gir cattle drink daily?"</p>
            </div>
          ) : (
            conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${msg.role === 'user' ? 'user-message' : 'assistant-message'} ${msg.error ? 'error-message' : ''}`}
              >
                <div className="message-content">
                  {msg.content.split('\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
                {msg.role === 'assistant' && msg.confidence && (
                  <div className="message-meta">
                    <span className="confidence-badge">
                      {Math.round(msg.confidence * 100)}% confidence
                    </span>
                    {msg.sources && msg.sources.length > 0 && (
                      <span className="sources-count">
                        {msg.sources.length} source{msg.sources.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                )}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="message-sources">
                    <strong>Sources:</strong>
                    <ul>
                      {msg.sources.map((source, sIdx) => (
                        <li key={sIdx}>{source}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
          
          {loading && (
            <div className="chat-message assistant-message">
              <div className="message-content">
                <LoadingSpinner />
                <span style={{ marginLeft: '10px' }}>Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="chat-input-container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <div className="chat-input-wrapper">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('advisor.question.placeholder') || "Type your question here..."}
                className="chat-input"
                rows={2}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
              />
              <div className="chat-actions">
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="btn btn-secondary btn-small"
                  disabled={conversation.length === 0}
                  title="Clear conversation"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="btn btn-primary btn-small"
                >
                  {loading ? <LoadingSpinner /> : 'Send'}
                </button>
              </div>
            </div>
            <div className="chat-hint">
              Press Enter to send, Shift+Enter for new line
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Advisor
