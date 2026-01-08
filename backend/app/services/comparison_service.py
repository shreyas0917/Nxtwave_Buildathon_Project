"""
Service for comparison analysis
"""

from typing import List, Dict
from app.schemas.reports import ComparisonRequest, ComparisonResponse
from app.services.trends_service import TrendsService


class ComparisonService:
    """Service for comparative analysis"""
    
    def __init__(self):
        self.trends_service = TrendsService()
    
    async def compare(self, request: ComparisonRequest) -> ComparisonResponse:
        """Perform comparison analysis"""
        items_data = []
        insights = []
        
        if request.comparison_type == "breed":
            # Compare breeds
            for breed in request.items:
                trends = await self.trends_service.get_trends(None, None, request.period)
                breed_trend = next((b for b in trends.breed_trends if b.breed == breed), None)
                
                if breed_trend:
                    items_data.append({
                        "name": breed,
                        "total_assessments": breed_trend.total_assessments,
                        "low_risk_pct": (breed_trend.low_risk_count / breed_trend.total_assessments * 100) if breed_trend.total_assessments > 0 else 0,
                        "medium_risk_pct": (breed_trend.medium_risk_count / breed_trend.total_assessments * 100) if breed_trend.total_assessments > 0 else 0,
                        "high_risk_pct": (breed_trend.high_risk_count / breed_trend.total_assessments * 100) if breed_trend.total_assessments > 0 else 0,
                        "avg_confidence": breed_trend.average_confidence
                    })
            
            # Generate insights
            if len(items_data) > 1:
                best_breed = max(items_data, key=lambda x: x['low_risk_pct'])
                insights.append(f"{best_breed['name']} shows the best health metrics with {best_breed['low_risk_pct']:.1f}% low risk assessments")
        
        elif request.comparison_type == "time":
            # Compare time periods
            for period in request.items:
                trends = await self.trends_service.get_trends(None, None, period)
                summary = trends.summary
                items_data.append({
                    "name": period,
                    "total_assessments": summary.get("total_assessments", 0),
                    "low_risk_pct": summary.get("low_risk_percentage", 0),
                    "medium_risk_pct": summary.get("medium_risk_percentage", 0),
                    "high_risk_pct": summary.get("high_risk_percentage", 0)
                })
            
            if len(items_data) > 1:
                improving = any(items_data[i]['low_risk_pct'] > items_data[i-1]['low_risk_pct'] 
                              for i in range(1, len(items_data)))
                insights.append("Health trends are " + ("improving" if improving else "stable"))
        
        elif request.comparison_type == "region":
            # Compare regions
            for region in request.items:
                # Split region into state/district if possible
                parts = region.split(",")
                state = parts[0].strip() if len(parts) > 0 else None
                district = parts[1].strip() if len(parts) > 1 else None
                
                trends = await self.trends_service.get_trends(district, state, request.period)
                summary = trends.summary
                items_data.append({
                    "name": region,
                    "total_assessments": summary.get("total_assessments", 0),
                    "low_risk_pct": summary.get("low_risk_percentage", 0),
                    "medium_risk_pct": summary.get("medium_risk_percentage", 0),
                    "high_risk_pct": summary.get("high_risk_percentage", 0)
                })
            
            if len(items_data) > 1:
                best_region = max(items_data, key=lambda x: x['low_risk_pct'])
                insights.append(f"{best_region['name']} has the best health outcomes")
        
        if not insights:
            insights.append("Comparison analysis completed successfully")
        
        return ComparisonResponse(
            comparison_type=request.comparison_type,
            items=items_data,
            insights=insights
        )

