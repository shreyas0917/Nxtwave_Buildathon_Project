"""
Test Data Generator for Advanced Features
Use this to test all the new advanced features
"""

import base64
import json
from PIL import Image
import io
from datetime import datetime, timedelta
import random


def create_test_image(color='red', size=(256, 256)):
    """Create a test image"""
    img = Image.new('RGB', size, color=color)
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    return base64.b64encode(buffer.getvalue()).decode()


def generate_batch_test_data():
    """Generate test data for batch processing"""
    print("\n" + "="*60)
    print("BATCH PROCESSING TEST DATA")
    print("="*60)
    
    # Create 5 test images with different colors
    images = []
    animal_ids = []
    colors = ['red', 'green', 'blue', 'yellow', 'orange']
    
    for i, color in enumerate(colors):
        img_base64 = create_test_image(color)
        images.append(img_base64)
        animal_ids.append(f"TEST-ANI-{i+1:03d}")
    
    test_data = {
        "images": images,
        "animal_ids": animal_ids,
        "region": "Gujarat"
    }
    
    print(f"Generated {len(images)} test images")
    print(f"Animal IDs: {animal_ids}")
    print("\nTo test, use this JSON in Postman or frontend:")
    print(json.dumps(test_data, indent=2))
    
    return test_data


def generate_recommendations_test_data():
    """Generate test data for recommendations"""
    print("\n" + "="*60)
    print("RECOMMENDATIONS TEST DATA")
    print("="*60)
    
    test_cases = [
        {
            "name": "High Risk Case",
            "data": {
                "breed": "Gir",
                "risk_level": "High",
                "visual_cues": ["Body Condition Score", "Eye/Nose Discharge"],
                "region": "Gujarat",
                "season": "summer"
            }
        },
        {
            "name": "Medium Risk Case",
            "data": {
                "breed": "Murrah",
                "risk_level": "Medium",
                "visual_cues": ["Coat Quality"],
                "region": "Punjab",
                "season": "monsoon"
            }
        },
        {
            "name": "Low Risk Case",
            "data": {
                "breed": "Sahiwal",
                "risk_level": "Low",
                "visual_cues": [],
                "region": "Haryana",
                "season": "winter"
            }
        }
    ]
    
    for case in test_cases:
        print(f"\n{case['name']}:")
        print(json.dumps(case['data'], indent=2))
    
    return test_cases


def generate_report_test_data():
    """Generate test data for health reports"""
    print("\n" + "="*60)
    print("HEALTH REPORTS TEST DATA")
    print("="*60)
    
    # Generate sample assessments
    assessments = []
    base_date = datetime.now() - timedelta(days=30)
    
    for i in range(10):
        date = base_date + timedelta(days=i*3)
        risk_levels = ['Low', 'Medium', 'High']
        risk = random.choice(risk_levels)
        
        assessment = {
            "date": date.isoformat(),
            "risk_level": risk,
            "confidence": round(random.uniform(0.65, 0.95), 2),
            "breed": random.choice(['Gir', 'Murrah', 'Sahiwal', 'Jaffarabadi']),
            "visual_cues": random.sample(
                ['Body Condition Score', 'Coat Quality', 'Eye/Nose Discharge'],
                random.randint(0, 2)
            )
        }
        assessments.append(assessment)
    
    test_data = {
        "animal_id": "TEST-ANI-001",
        "breed": "Gir",
        "assessments": assessments,
        "start_date": base_date.isoformat(),
        "end_date": datetime.now().isoformat()
    }
    
    print(f"Generated {len(assessments)} sample assessments")
    print("\nTest data:")
    print(json.dumps(test_data, indent=2, default=str))
    
    return test_data


def generate_comparison_test_data():
    """Generate test data for comparison"""
    print("\n" + "="*60)
    print("COMPARISON TEST DATA")
    print("="*60)
    
    test_cases = [
        {
            "name": "Breed Comparison",
            "data": {
                "comparison_type": "breed",
                "items": ["Gir", "Murrah", "Sahiwal", "Jaffarabadi"],
                "period": "last_30_days"
            }
        },
        {
            "name": "Time Period Comparison",
            "data": {
                "comparison_type": "time",
                "items": ["last_7_days", "last_30_days", "last_90_days"],
                "period": "last_30_days"
            }
        },
        {
            "name": "Region Comparison",
            "data": {
                "comparison_type": "region",
                "items": ["Gujarat", "Punjab", "Haryana"],
                "period": "last_30_days"
            }
        }
    ]
    
    for case in test_cases:
        print(f"\n{case['name']}:")
        print(json.dumps(case['data'], indent=2))
    
    return test_cases


def generate_qrcode_test_data():
    """Generate test data for QR codes"""
    print("\n" + "="*60)
    print("QR CODE TEST DATA")
    print("="*60)
    
    test_cases = [
        {
            "animal_id": "TEST-ANI-001",
            "breed": "Gir"
        },
        {
            "animal_id": "TEST-ANI-002",
            "breed": "Murrah"
        },
        {
            "animal_id": "TEST-ANI-003",
            "breed": None
        }
    ]
    
    print("Test cases:")
    for case in test_cases:
        print(json.dumps(case, indent=2))
    
    return test_cases


def generate_analytics_test_data():
    """Generate test data for analytics"""
    print("\n" + "="*60)
    print("ANALYTICS TEST DATA")
    print("="*60)
    
    test_cases = [
        {
            "state": "Gujarat",
            "district": "Ahmedabad",
            "period": "last_30_days"
        },
        {
            "state": "Punjab",
            "district": None,
            "period": "last_7_days"
        },
        {
            "state": None,
            "district": None,
            "period": "last_90_days"
        }
    ]
    
    print("Test cases:")
    for case in test_cases:
        print(json.dumps(case, indent=2))
    
    return test_cases


def generate_historical_tracking_data():
    """Generate test data for historical tracking"""
    print("\n" + "="*60)
    print("HISTORICAL TRACKING TEST DATA")
    print("="*60)
    
    animal_id = "TEST-ANI-001"
    history = []
    base_date = datetime.now() - timedelta(days=60)
    
    for i in range(20):
        date = base_date + timedelta(days=i*3)
        risk_levels = ['Low', 'Medium', 'High']
        risk = random.choice(risk_levels)
        
        history.append({
            "date": date.strftime("%Y-%m-%d"),
            "risk_level": risk,
            "confidence": round(random.uniform(0.70, 0.95), 2),
            "breed": "Gir",
            "visual_cues": random.sample(
                ['Body Condition Score', 'Coat Quality', 'Eye/Nose Discharge'],
                random.randint(0, 2)
            )
        })
    
    test_data = {
        "animal_id": animal_id,
        "history": history
    }
    
    print(f"Generated {len(history)} historical records for {animal_id}")
    print("\nSample data (first 5 records):")
    print(json.dumps(history[:5], indent=2))
    
    return test_data


def generate_notification_test_data():
    """Generate test data for notifications"""
    print("\n" + "="*60)
    print("NOTIFICATION TEST DATA")
    print("="*60)
    
    test_cases = [
        {
            "title": "High Risk Alert",
            "message": "A high-risk assessment was detected for Animal TEST-ANI-001. Please consult a veterinarian.",
            "type": "warning"
        },
        {
            "title": "Batch Processing Complete",
            "message": "Successfully processed 5 animals. 4 successful, 1 error.",
            "type": "success"
        },
        {
            "title": "New Recommendations Available",
            "message": "New care recommendations are available for your animals.",
            "type": "info"
        }
    ]
    
    print("Test notification cases:")
    for case in test_cases:
        print(json.dumps(case, indent=2))
    
    return test_cases


def main():
    """Generate all test data"""
    print("\n" + "="*60)
    print("ADVANCED FEATURES TEST DATA GENERATOR")
    print("="*60)
    
    # Generate all test data
    batch_data = generate_batch_test_data()
    recommendations_data = generate_recommendations_test_data()
    report_data = generate_report_test_data()
    comparison_data = generate_comparison_test_data()
    qrcode_data = generate_qrcode_test_data()
    analytics_data = generate_analytics_test_data()
    historical_data = generate_historical_tracking_data()
    notification_data = generate_notification_test_data()
    
    # Save to file
    all_data = {
        "batch_processing": batch_data,
        "recommendations": recommendations_data,
        "reports": report_data,
        "comparison": comparison_data,
        "qrcode": qrcode_data,
        "analytics": analytics_data,
        "historical_tracking": historical_data,
        "notifications": notification_data
    }
    
    import os
    os.makedirs("test_data", exist_ok=True)
    
    with open("test_data/test_data.json", "w") as f:
        json.dump(all_data, f, indent=2, default=str)
    
    print("\n" + "="*60)
    print("All test data saved to: test_data/test_data.json")
    print("="*60)


if __name__ == "__main__":
    main()

