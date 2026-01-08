"""
Feedback service for storing and aggregating farmer feedback
"""

import uuid
from datetime import datetime
from typing import Optional
import json
import os

from app.schemas.feedback import FeedbackRequest


class FeedbackService:
    """Service for managing feedback"""
    
    def __init__(self):
        # In production, use database
        self.feedback_store = []
        self.feedback_file = "data/feedback.json"
        self._load_feedback()
    
    def _load_feedback(self):
        """Load feedback from file if exists"""
        if os.path.exists(self.feedback_file):
            try:
                with open(self.feedback_file, 'r', encoding='utf-8') as f:
                    self.feedback_store = json.load(f)
            except Exception as e:
                print(f"Error loading feedback: {e}")
                self.feedback_store = []
    
    def _save_feedback(self):
        """Save feedback to file"""
        os.makedirs(os.path.dirname(self.feedback_file), exist_ok=True)
        try:
            with open(self.feedback_file, 'w', encoding='utf-8') as f:
                json.dump(self.feedback_store, f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving feedback: {e}")
    
    async def store_feedback(self, request: FeedbackRequest) -> str:
        """
        Store feedback submission
        
        Returns:
            Feedback ID
        """
        feedback_id = f"fb_{uuid.uuid4().hex[:10]}"
        
        feedback_entry = {
            "id": feedback_id,
            "prediction_type": request.prediction_type,
            "outcome": request.outcome,
            "region": request.region,
            "vet_consulted": request.vet_consulted,
            "comments": request.comments,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Store in memory and file
        self.feedback_store.append(feedback_entry)
        self._save_feedback()
        
        return feedback_id
    
    async def get_feedback_stats(
        self,
        region: Optional[str] = None,
        prediction_type: Optional[str] = None
    ) -> dict:
        """Get aggregated feedback statistics"""
        filtered = self.feedback_store
        
        if region:
            filtered = [f for f in filtered if f.get("region") == region]
        if prediction_type:
            filtered = [f for f in filtered if f.get("prediction_type") == prediction_type]
        
        if not filtered:
            return {"total": 0, "outcomes": {}}
        
        outcomes = {}
        for entry in filtered:
            outcome = entry.get("outcome", "unknown")
            outcomes[outcome] = outcomes.get(outcome, 0) + 1
        
        return {
            "total": len(filtered),
            "outcomes": outcomes
        }
