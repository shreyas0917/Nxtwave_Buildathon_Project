"""
Service for AI-powered care recommendations
"""

from typing import List, Dict
from app.schemas.reports import RecommendationRequest, RecommendationResponse
from app.schemas.risk import RiskLevel
from datetime import datetime


class RecommendationService:
    """Service for generating care recommendations"""
    
    def __init__(self):
        self.season = self._get_current_season()
    
    def _get_current_season(self) -> str:
        """Get current season in India"""
        month = datetime.now().month
        if month in [12, 1, 2]:
            return "winter"
        elif month in [3, 4, 5]:
            return "summer"
        elif month in [6, 7, 8, 9]:
            return "monsoon"
        else:
            return "post_monsoon"
    
    async def get_recommendations(self, request: RecommendationRequest) -> RecommendationResponse:
        """Generate personalized care recommendations"""
        recommendations = []
        priority = "Low"
        
        # Risk-based recommendations
        if request.risk_level == RiskLevel.HIGH:
            priority = "High"
            recommendations.append({
                "title": "Immediate Veterinary Consultation",
                "description": "High risk detected. Consult a veterinarian as soon as possible for proper assessment.",
                "priority": "High",
                "category": "Medical",
                "estimated_impact": "Critical - Can prevent serious health issues"
            })
            recommendations.append({
                "title": "Enhanced Monitoring",
                "description": "Monitor the animal closely for any changes in behavior, appetite, or appearance.",
                "priority": "High",
                "category": "Monitoring",
                "estimated_impact": "High - Early detection of issues"
            })
        elif request.risk_level == RiskLevel.MEDIUM:
            priority = "Medium"
            recommendations.append({
                "title": "Preventive Care",
                "description": "Schedule a preventive health checkup with a veterinarian within the next week.",
                "priority": "Medium",
                "category": "Preventive",
                "estimated_impact": "Medium - Prevents escalation"
            })
        
        # Visual cue-based recommendations
        if "Body Condition Score" in request.visual_cues:
            recommendations.append({
                "title": "Nutritional Assessment",
                "description": "Review feeding practices and ensure balanced nutrition. Consider consulting a nutritionist.",
                "priority": "Medium",
                "category": "Nutrition",
                "estimated_impact": "High - Improves overall health"
            })
        
        if "Coat Quality" in request.visual_cues:
            recommendations.append({
                "title": "Coat Care",
                "description": "Ensure proper grooming and check for parasites. Dull coat may indicate nutritional deficiencies.",
                "priority": "Medium",
                "category": "Grooming",
                "estimated_impact": "Medium - Improves appearance and health"
            })
        
        if "Eye/Nose Discharge" in request.visual_cues:
            recommendations.append({
                "title": "Respiratory Health Check",
                "description": "Monitor for respiratory issues. Ensure clean environment and proper ventilation.",
                "priority": "High",
                "category": "Health",
                "estimated_impact": "High - Prevents respiratory diseases"
            })
        
        # Season-based recommendations
        if self.season == "summer":
            recommendations.append({
                "title": "Heat Stress Management",
                "description": "Ensure adequate shade, water supply (40-60L daily), and avoid working animals during peak heat hours.",
                "priority": "High",
                "category": "Seasonal",
                "estimated_impact": "High - Prevents heat stress"
            })
        elif self.season == "monsoon":
            recommendations.append({
                "title": "Hygiene and Shelter",
                "description": "Maintain dry, clean shelter. Prevent waterlogging and ensure proper drainage.",
                "priority": "Medium",
                "category": "Seasonal",
                "estimated_impact": "Medium - Prevents infections"
            })
        elif self.season == "winter":
            recommendations.append({
                "title": "Cold Weather Care",
                "description": "Provide warm shelter, increase feed quantity, and protect from cold winds.",
                "priority": "Medium",
                "category": "Seasonal",
                "estimated_impact": "Medium - Maintains health in cold"
            })
        
        # Breed-specific recommendations
        if request.breed:
            breed_recs = self._get_breed_recommendations(request.breed)
            recommendations.extend(breed_recs)
        
        # General recommendations (always include)
        if not any(r["category"] == "General" for r in recommendations):
            recommendations.append({
                "title": "Regular Health Monitoring",
                "description": "Conduct regular health assessments and maintain health records.",
                "priority": "Low",
                "category": "General",
                "estimated_impact": "Medium - Long-term health tracking"
            })
        
        # Determine overall priority
        if any(r["priority"] == "High" for r in recommendations):
            priority = "High"
        elif any(r["priority"] == "Medium" for r in recommendations):
            priority = "Medium"
        
        estimated_impact = "High impact on animal health and productivity" if priority == "High" else \
                          "Moderate impact with preventive benefits" if priority == "Medium" else \
                          "Long-term health maintenance"
        
        return RecommendationResponse(
            recommendations=recommendations,
            priority=priority,
            estimated_impact=estimated_impact
        )
    
    def _get_breed_recommendations(self, breed: str) -> List[Dict]:
        """Get breed-specific recommendations"""
        breed_recs = {
            "Gir": [{
                "title": "Gir-Specific Care",
                "description": "Gir cattle require 40-50L water daily. Provide balanced nutrition with green fodder.",
                "priority": "Medium",
                "category": "Breed-Specific",
                "estimated_impact": "High - Optimizes breed performance"
            }],
            "Murrah": [{
                "title": "Murrah Buffalo Care",
                "description": "Murrah buffalo need 50-60L water daily. Provide wallowing facilities if possible.",
                "priority": "Medium",
                "category": "Breed-Specific",
                "estimated_impact": "High - Essential for buffalo health"
            }],
            "Sahiwal": [{
                "title": "Sahiwal Heat Tolerance",
                "description": "Sahiwal are heat-tolerant but still need adequate shade and water during summer.",
                "priority": "Low",
                "category": "Breed-Specific",
                "estimated_impact": "Medium - Maintains productivity"
            }]
        }
        
        return breed_recs.get(breed, [])

