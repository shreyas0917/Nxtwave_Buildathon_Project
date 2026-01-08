"""
Schemas for notifications and alerts
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.schemas.risk import RiskLevel


class AlertRule(BaseModel):
    """Alert rule configuration"""
    rule_name: str = Field(..., description="Name of the alert rule")
    condition: str = Field(..., description="Condition: 'risk_high', 'confidence_low', 'breed_specific'")
    threshold: Optional[float] = Field(None, description="Threshold value if applicable")
    breed: Optional[str] = Field(None, description="Breed filter if applicable")
    enabled: bool = Field(True, description="Whether rule is enabled")


class NotificationRequest(BaseModel):
    """Request to send notification"""
    title: str = Field(..., description="Notification title")
    message: str = Field(..., description="Notification message")
    type: str = Field("info", description="Type: info, warning, success, error")
    user_id: Optional[str] = Field(None, description="Target user ID")


class NotificationResponse(BaseModel):
    """Notification response"""
    notification_id: str = Field(..., description="Notification ID")
    title: str
    message: str
    type: str
    timestamp: datetime = Field(..., description="Notification timestamp")
    read: bool = Field(False, description="Whether notification was read")


class AlertResponse(BaseModel):
    """Alert rule response"""
    rule_id: str = Field(..., description="Alert rule ID")
    rule_name: str
    enabled: bool
    created_at: datetime

