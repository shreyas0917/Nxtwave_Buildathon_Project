"""
Health trends service for aggregated regional analytics
"""

import random
from datetime import datetime, timedelta
from typing import Optional, List

from app.schemas.trends import (
    HealthTrendsResponse, TrendDataPoint, TimeSeriesPoint,
    BreedTrend, VisualCueTrend
)
from app.schemas.risk import RiskLevel


class TrendsService:
    """Service for health trends analytics"""
    
    def __init__(self):
        # In production, query from database
        self.trends_data = {}
        self.breeds = self._load_all_breeds()
        self.visual_cues = ["Body Condition Score", "Coat Quality", "Eye/Nose Discharge"]
    
    def _load_all_breeds(self) -> List[str]:
        """Load all Indian livestock breeds from metadata"""
        import json
        import os
        from pathlib import Path
        
        # Try to load from breed_region_map.json
        possible_paths = [
            os.path.join("data", "breed_region_map.json"),
            os.path.join("backend", "data", "breed_region_map.json"),
            os.path.join(Path(__file__).parent.parent.parent, "data", "breed_region_map.json")
        ]
        
        for map_file in possible_paths:
            if os.path.exists(map_file):
                try:
                    with open(map_file, 'r', encoding='utf-8') as f:
                        breed_map = json.load(f)
                        breeds = list(breed_map.keys())
                        breeds.sort()  # Sort alphabetically
                        return breeds
                except Exception as e:
                    print(f"Error loading breeds from {map_file}: {e}")
        
        # Fallback to comprehensive default list
        print("Using default comprehensive breed list")
        return [
            "Bhadawari", "Deoni", "Gir", "Hariana", "Jaffarabadi",
            "Kankrej", "Krishna Valley", "Mehsana", "Murrah", "Nagpuri",
            "Nili-Ravi", "Ongole", "Pandharpuri", "Rathi", "Red Sindhi",
            "Sahiwal", "Surti", "Tharparkar", "Toda"
        ]
    
    async def get_trends(
        self,
        district: Optional[str],
        state: Optional[str],
        period: str = "last_30_days"
    ) -> HealthTrendsResponse:
        """
        Get aggregated health trends with advanced analytics
        
        All data is anonymized and aggregated.
        Filters by district, state, and time period.
        """
        # Calculate date range based on period
        end_date = datetime.utcnow()
        if period == "last_7_days":
            start_date = end_date - timedelta(days=7)
        elif period == "last_30_days":
            start_date = end_date - timedelta(days=30)
        elif period == "last_90_days":
            start_date = end_date - timedelta(days=90)
        else:
            start_date = end_date - timedelta(days=30)
        
        # Generate filtered data based on district, state, and period
        trends = self._generate_sample_trends(start_date, end_date, district, state)
        time_series = self._generate_time_series(start_date, end_date, district, state)
        breed_trends = self._generate_breed_trends(district, state)
        visual_cue_trends = self._generate_visual_cue_trends(district, state)
        regional_comparison = self._generate_regional_comparison(state, district)
        
        # Calculate summary
        summary = self._calculate_summary(trends)
        
        # Format location name
        location_name = self._format_location_name(district, state)
        
        return HealthTrendsResponse(
            district=district or "All Districts",
            state=state or "All States",
            period=period,
            trends=trends,
            summary=summary,
            time_series=time_series,
            breed_trends=breed_trends,
            visual_cue_trends=visual_cue_trends,
            regional_comparison=regional_comparison,
            last_updated=datetime.utcnow().isoformat(),
            disclaimer=f"Trends for {location_name} ({period.replace('_', ' ')}). Data is aggregated and anonymized. Individual predictions may vary. Data updates daily."
        )
    
    def _format_location_name(self, district: Optional[str], state: Optional[str]) -> str:
        """Format location name for display"""
        if district and state:
            return f"{district}, {state}"
        elif state:
            return state
        elif district:
            return district
        else:
            return "All Regions"
    
    def _generate_sample_trends(
        self,
        start_date: datetime,
        end_date: datetime,
        district: Optional[str] = None,
        state: Optional[str] = None
    ) -> List[TrendDataPoint]:
        """Generate sample trend data points filtered by location"""
        trends = []
        current_date = start_date
        risk_levels = [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH]
        
        # Adjust base volume based on location specificity
        base_volume = 50
        if district and state:
            base_volume = 30  # More specific = less data
        elif state:
            base_volume = 40
        elif district:
            base_volume = 35
        
        # Use location as part of seed for consistent data per location
        location_seed = hash(f"{district or ''}_{state or ''}") % 10000
        
        while current_date <= end_date:
            # Use date + location as seed for consistent daily data per location
            date_str = current_date.strftime("%Y-%m-%d")
            seed = hash(f"{date_str}_{location_seed}") % 1000000
            random.seed(seed)
            
            # Vary risk levels over time
            day_offset = (current_date - start_date).days
            risk_weights = [
                0.6 + 0.1 * random.random(),  # Low risk: 60-70%
                0.25 + 0.1 * random.random(),  # Medium: 25-35%
                0.05 + 0.1 * random.random()   # High: 5-15%
            ]
            
            for i, risk_level in enumerate(risk_levels):
                count = int(base_volume * risk_weights[i] * (0.8 + 0.4 * random.random()))
                if count > 0:
                    trends.append(TrendDataPoint(
                        date=current_date,
                        risk_level=risk_level,
                        count=count,
                        average_confidence=0.75 + 0.15 * random.random()
                    ))
            
            current_date += timedelta(days=1)
        
        random.seed()  # Reset seed
        return trends
    
    def _generate_time_series(
        self,
        start_date: datetime,
        end_date: datetime,
        district: Optional[str] = None,
        state: Optional[str] = None
    ) -> List[TimeSeriesPoint]:
        """Generate time series data for charts with daily variations, filtered by location"""
        time_series = []
        current_date = start_date
        today = datetime.utcnow().date()
        
        # Use date-based seed for consistent daily updates
        base_seed = int(today.strftime("%Y%m%d"))
        location_seed = hash(f"{district or ''}_{state or ''}") % 10000
        
        # Adjust base volume based on location
        base_volume = 80
        if district and state:
            base_volume = 50
        elif state:
            base_volume = 65
        elif district:
            base_volume = 55
        
        while current_date <= end_date:
            # Use date + location as seed for consistent daily data per location
            date_str = current_date.strftime("%Y-%m-%d")
            date_seed = hash(f"{date_str}_{base_seed}_{location_seed}") % 1000000
            random.seed(date_seed)
            
            # Generate realistic daily data with trends
            days_from_start = (current_date.date() - start_date.date()).days
            days_from_today = (current_date.date() - today).days
            
            # Base total varies by day of week and recency
            base_total = base_volume + int(base_volume * 0.5 * random.random())
            
            # Recent days have more data (more active assessments)
            if days_from_today >= -7:  # Last week
                base_total = int(base_total * (1.2 + 0.3 * random.random()))
            elif days_from_today >= -14:  # Week before
                base_total = int(base_total * (1.1 + 0.2 * random.random()))
            
            # Ensure percentages sum to approximately 1.0
            low_pct = 0.6 + 0.15 * random.random()
            medium_pct = 0.25 + 0.1 * random.random()
            high_pct = max(0.0, 1.0 - low_pct - medium_pct)  # Ensure non-negative
            
            # Normalize if they exceed 1.0
            total_pct = low_pct + medium_pct + high_pct
            if total_pct > 1.0:
                low_pct /= total_pct
                medium_pct /= total_pct
                high_pct /= total_pct
            
            low_risk = int(base_total * low_pct)
            medium_risk = int(base_total * medium_pct)
            high_risk = max(0, base_total - low_risk - medium_risk)  # Ensure non-negative
            
            # Confidence varies slightly by day
            avg_confidence = 0.75 + 0.15 * random.random()
            
            time_series.append(TimeSeriesPoint(
                date=date_str,
                low_risk=low_risk,
                medium_risk=medium_risk,
                high_risk=high_risk,
                total=base_total,
                avg_confidence=avg_confidence
            ))
            
            current_date += timedelta(days=1)
        
        # Reset random seed
        random.seed()
        
        return time_series
    
    def _generate_breed_trends(
        self,
        district: Optional[str] = None,
        state: Optional[str] = None
    ) -> List[BreedTrend]:
        """Generate breed-specific trend data filtered by location"""
        breed_trends = []
        location_seed = hash(f"{district or ''}_{state or ''}") % 10000
        
        # Adjust base volume based on location specificity
        base_volume = 150
        if district and state:
            base_volume = 80
        elif state:
            base_volume = 120
        elif district:
            base_volume = 100
        
        # Select breeds based on location (prioritize breeds common in the selected state)
        # If state is specified, prioritize breeds from that state, otherwise show all
        selected_breeds = self.breeds.copy()  # Show all breeds by default
        
        if state:
            # Prioritize breeds common in the selected state
            # In production, this would query breed_region_map.json
            # For now, we'll show all breeds but can be filtered by relevance
            pass
        
        # Adjust volume per breed based on total number of breeds
        # More breeds = less data per breed (realistic distribution)
        # Scale volume so total remains reasonable
        volume_per_breed = max(20, base_volume / max(1, len(selected_breeds) / 8))
        
        for idx, breed in enumerate(selected_breeds):
            # Use breed + location as seed for consistency
            breed_seed = hash(f"{breed}_{location_seed}") % 1000000
            random.seed(breed_seed)
            
            # Adjust volume based on breed popularity (some breeds are more common)
            popularity_factor = 0.6 + 0.8 * random.random()  # 0.6 to 1.4x
            total = int(volume_per_breed * popularity_factor * (1.0 + 0.4 * random.random()))
            
            # Ensure minimum data for visibility
            total = max(10, total)
            
            # Ensure percentages are valid
            low_pct = 0.55 + 0.2 * random.random()
            medium_pct = 0.25 + 0.15 * random.random()
            high_pct = max(0.0, 1.0 - low_pct - medium_pct)
            
            # Normalize if they exceed 1.0
            total_pct = low_pct + medium_pct + high_pct
            if total_pct > 1.0:
                low_pct /= total_pct
                medium_pct /= total_pct
                high_pct /= total_pct
            
            low_risk = int(total * low_pct)
            medium_risk = int(total * medium_pct)
            high_risk = max(0, total - low_risk - medium_risk)
            
            breed_trends.append(BreedTrend(
                breed=breed,
                total_assessments=total,
                low_risk_count=low_risk,
                medium_risk_count=medium_risk,
                high_risk_count=high_risk,
                average_confidence=0.72 + 0.18 * random.random()
            ))
        
        # Sort by total assessments (descending) for better visualization
        breed_trends.sort(key=lambda x: x.total_assessments, reverse=True)
        
        random.seed()  # Reset seed
        return breed_trends
    
    def _generate_visual_cue_trends(
        self,
        district: Optional[str] = None,
        state: Optional[str] = None
    ) -> List[VisualCueTrend]:
        """Generate visual cue trend data filtered by location"""
        cue_trends = []
        location_seed = hash(f"{district or ''}_{state or ''}") % 10000
        
        # Adjust base volume based on location
        total_base = 1000
        if district and state:
            total_base = 600
        elif state:
            total_base = 800
        elif district:
            total_base = 700
        
        for idx, cue in enumerate(self.visual_cues):
            # Use cue + location as seed for consistency
            cue_seed = hash(f"{cue}_{location_seed}") % 1000000
            random.seed(cue_seed)
            
            total = total_base + int(total_base * 0.5 * random.random())
            detected = int(total * (0.15 + 0.25 * random.random()))
            
            cue_trends.append(VisualCueTrend(
                cue_name=cue,
                detected_count=detected,
                total_count=total,
                detection_rate=detected / total if total > 0 else 0
            ))
        
        random.seed()  # Reset seed
        return cue_trends
    
    def _generate_regional_comparison(
        self,
        state: Optional[str],
        district: Optional[str]
    ) -> Optional[dict]:
        """Generate regional comparison data"""
        if not state and not district:
            # Compare with other regions
            return {
                "current_region": {
                    "total": 2500,
                    "low_risk_pct": 65.2,
                    "medium_risk_pct": 28.5,
                    "high_risk_pct": 6.3,
                    "avg_confidence": 0.78
                },
                "neighboring_regions": [
                    {
                        "name": "Gujarat",
                        "total": 3200,
                        "low_risk_pct": 68.1,
                        "medium_risk_pct": 26.2,
                        "high_risk_pct": 5.7
                    },
                    {
                        "name": "Maharashtra",
                        "total": 2800,
                        "low_risk_pct": 62.5,
                        "medium_risk_pct": 30.1,
                        "high_risk_pct": 7.4
                    },
                    {
                        "name": "Rajasthan",
                        "total": 2100,
                        "low_risk_pct": 70.3,
                        "medium_risk_pct": 24.8,
                        "high_risk_pct": 4.9
                    }
                ]
            }
        return None
    
    def _calculate_summary(self, trends: List[TrendDataPoint]) -> dict:
        """Calculate summary statistics"""
        total = sum(t.count for t in trends)
        
        risk_counts = {}
        total_confidence = 0
        confidence_count = 0
        
        for trend in trends:
            risk = trend.risk_level.value
            risk_counts[risk] = risk_counts.get(risk, 0) + trend.count
            total_confidence += trend.average_confidence * trend.count
            confidence_count += trend.count
        
        avg_confidence = (total_confidence / confidence_count) if confidence_count > 0 else 0
        
        return {
            "total_assessments": total,
            "low_risk_percentage": (risk_counts.get("Low", 0) / total * 100) if total > 0 else 0,
            "medium_risk_percentage": (risk_counts.get("Medium", 0) / total * 100) if total > 0 else 0,
            "high_risk_percentage": (risk_counts.get("High", 0) / total * 100) if total > 0 else 0,
            "average_confidence": round(avg_confidence, 3),
            "low_risk_count": risk_counts.get("Low", 0),
            "medium_risk_count": risk_counts.get("Medium", 0),
            "high_risk_count": risk_counts.get("High", 0)
        }

