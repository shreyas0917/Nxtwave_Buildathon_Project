import React, { useState, useEffect } from 'react'
import './NotificationSystem.css'

function NotificationSystem() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Listen for high-risk assessments
    const handleHighRisk = (event) => {
      addNotification({
        type: 'warning',
        title: 'High Risk Detected',
        message: 'A high-risk assessment was detected. Please consult a veterinarian.',
        duration: 10000
      })
    }

    // Listen for batch processing completion
    const handleBatchComplete = (event) => {
      addNotification({
        type: 'success',
        title: 'Batch Processing Complete',
        message: `Successfully processed ${event.detail.count} animals`,
        duration: 5000
      })
    }

    window.addEventListener('high-risk-detected', handleHighRisk)
    window.addEventListener('batch-complete', handleBatchComplete)

    return () => {
      window.removeEventListener('high-risk-detected', handleHighRisk)
      window.removeEventListener('batch-complete', handleBatchComplete)
    }
  }, [])

  const addNotification = (notification) => {
    const id = Date.now()
    const newNotification = { ...notification, id }
    setNotifications(prev => [...prev, newNotification])

    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="notification-close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem

