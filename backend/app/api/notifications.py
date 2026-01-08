"""
API endpoints for real-time notifications and alerts
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional, List
from datetime import datetime
import json

from app.schemas.notifications import (
    NotificationRequest, NotificationResponse,
    AlertRule, AlertResponse
)
from app.services.notification_service import NotificationService

router = APIRouter()


@router.post("/create-alert-rule", response_model=AlertResponse)
async def create_alert_rule(rule: AlertRule):
    """
    Create custom alert rule for health monitoring
    
    Examples:
    - Alert when risk level is High
    - Alert when confidence drops below threshold
    - Alert for specific breeds
    """
    try:
        notification_service = NotificationService()
        alert = await notification_service.create_alert_rule(rule)
        return alert
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating alert rule: {str(e)}"
        )


@router.get("/notifications")
async def get_notifications(user_id: Optional[str] = None):
    """
    Get recent notifications and alerts
    """
    try:
        notification_service = NotificationService()
        notifications = await notification_service.get_notifications(user_id)
        return notifications
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching notifications: {str(e)}"
        )


@router.post("/send-notification", response_model=NotificationResponse)
async def send_notification(request: NotificationRequest):
    """
    Send a notification (for testing or manual alerts)
    """
    try:
        notification_service = NotificationService()
        notification = await notification_service.send_notification(request)
        return notification
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error sending notification: {str(e)}"
        )

