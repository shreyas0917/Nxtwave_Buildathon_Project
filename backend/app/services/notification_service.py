"""
Service for notifications and alerts
"""

import uuid
from datetime import datetime
from typing import List, Optional
from app.schemas.notifications import (
    AlertRule, NotificationRequest, NotificationResponse, AlertResponse
)


class NotificationService:
    """Service for managing notifications and alerts"""
    
    def __init__(self):
        self.notifications = []
        self.alert_rules = []
    
    async def create_alert_rule(self, rule: AlertRule) -> AlertResponse:
        """Create a new alert rule"""
        rule_id = str(uuid.uuid4())
        alert_response = AlertResponse(
            rule_id=rule_id,
            rule_name=rule.rule_name,
            enabled=rule.enabled,
            created_at=datetime.now()
        )
        self.alert_rules.append({
            "rule_id": rule_id,
            **rule.dict()
        })
        return alert_response
    
    async def get_notifications(self, user_id: Optional[str] = None) -> List[NotificationResponse]:
        """Get notifications for user"""
        # Filter by user_id if provided
        notifications = self.notifications
        if user_id:
            notifications = [n for n in notifications if n.get("user_id") == user_id]
        
        # Return recent notifications (last 50)
        return [
            NotificationResponse(**n) for n in notifications[-50:]
        ]
    
    async def send_notification(self, request: NotificationRequest) -> NotificationResponse:
        """Send a notification"""
        notification_id = str(uuid.uuid4())
        notification = NotificationResponse(
            notification_id=notification_id,
            title=request.title,
            message=request.message,
            type=request.type,
            timestamp=datetime.now(),
            read=False
        )
        self.notifications.append({
            **notification.dict(),
            "user_id": request.user_id
        })
        return notification
    
    async def check_alerts(self, assessment_result: dict) -> List[NotificationResponse]:
        """Check if assessment triggers any alert rules"""
        triggered = []
        
        for rule in self.alert_rules:
            if not rule.get("enabled"):
                continue
            
            condition = rule.get("condition")
            triggered_alert = False
            
            if condition == "risk_high" and assessment_result.get("risk_level") == "High":
                triggered_alert = True
            elif condition == "confidence_low":
                threshold = rule.get("threshold", 0.5)
                if assessment_result.get("confidence", 1.0) < threshold:
                    triggered_alert = True
            elif condition == "breed_specific":
                breed = rule.get("breed")
                if breed and assessment_result.get("breed") == breed:
                    triggered_alert = True
            
            if triggered_alert:
                notification = await self.send_notification(NotificationRequest(
                    title=f"Alert: {rule.get('rule_name')}",
                    message=f"Alert condition '{condition}' was triggered",
                    type="warning"
                ))
                triggered.append(notification)
        
        return triggered

