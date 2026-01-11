#!/usr/bin/env python3
"""
Initialize database with sample data for demo
Creates tables and populates with realistic demo data
"""

import os
import sys
from pathlib import Path
import sqlite3
from datetime import datetime, timedelta
import random

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.core.config import settings


def create_tables(conn):
    """Create necessary database tables"""
    cursor = conn.cursor()
    
    # Feedback table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            feedback_id TEXT UNIQUE NOT NULL,
            prediction_type TEXT NOT NULL,
            breed TEXT,
            region TEXT,
            risk_level TEXT,
            accuracy_rating INTEGER,
            helpful BOOLEAN,
            comments TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Assessments table (for trends)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assessment_id TEXT UNIQUE NOT NULL,
            assessment_type TEXT NOT NULL,
            breed TEXT,
            region TEXT,
            district TEXT,
            state TEXT,
            risk_level TEXT,
            confidence REAL,
            visual_cues TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Reports table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_id TEXT UNIQUE NOT NULL,
            animal_id TEXT,
            breed TEXT,
            report_type TEXT,
            file_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    print("✅ Database tables created")


def insert_sample_data(conn):
    """Insert sample data for demo"""
    cursor = conn.cursor()
    
    # Sample Indian states and districts
    locations = [
        ("Gujarat", "Ahmedabad"),
        ("Gujarat", "Surat"),
        ("Maharashtra", "Mumbai"),
        ("Maharashtra", "Pune"),
        ("Rajasthan", "Jaipur"),
        ("Punjab", "Ludhiana"),
        ("Haryana", "Karnal"),
        ("Uttar Pradesh", "Lucknow"),
    ]
    
    # Sample breeds
    breeds = [
        "Gir", "Sahiwal", "Red Sindhi", "Tharparkar", "Kankrej",
        "Ongole", "Hariana", "Krishna Valley", "Murrah", "Jaffarabadi"
    ]
    
    # Sample risk levels
    risk_levels = ["Low", "Medium", "High"]
    
    # Insert sample assessments (last 30 days)
    print("Inserting sample assessments...")
    for i in range(100):
        state, district = random.choice(locations)
        breed = random.choice(breeds)
        risk = random.choice(risk_levels)
        confidence = random.uniform(0.5, 0.95)
        
        # Date in last 30 days
        days_ago = random.randint(0, 30)
        created_at = datetime.now() - timedelta(days=days_ago)
        
        visual_cues = ["Body condition", "Coat quality", "Eye clarity"]
        if risk == "High":
            visual_cues.extend(["Discharge present", "Posture abnormal"])
        
        cursor.execute("""
            INSERT INTO assessments 
            (assessment_id, assessment_type, breed, region, district, state, 
             risk_level, confidence, visual_cues, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f"assess_{i:04d}",
            "risk",
            breed,
            f"{district}, {state}",
            district,
            state,
            risk,
            confidence,
            ",".join(visual_cues),
            created_at
        ))
    
    # Insert sample feedback
    print("Inserting sample feedback...")
    for i in range(50):
        breed = random.choice(breeds)
        state, _ = random.choice(locations)
        
        days_ago = random.randint(0, 30)
        created_at = datetime.now() - timedelta(days=days_ago)
        
        cursor.execute("""
            INSERT INTO feedback
            (feedback_id, prediction_type, breed, region, risk_level,
             accuracy_rating, helpful, comments, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f"fb_{i:04d}",
            "breed" if random.random() > 0.5 else "risk",
            breed,
            state,
            random.choice(risk_levels) if random.random() > 0.5 else None,
            random.randint(3, 5),  # 3-5 stars
            random.random() > 0.3,  # 70% helpful
            "Good prediction" if random.random() > 0.5 else "Very helpful",
            created_at
        ))
    
    conn.commit()
    print(f"✅ Inserted 100 sample assessments and 50 feedback entries")


def main():
    """Initialize database"""
    print("🔧 Initializing database...")
    
    # Create database directory if not exists
    db_path = backend_dir / "livestock_ai.db"
    db_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Connect to database
    conn = sqlite3.connect(str(db_path))
    
    try:
        # Create tables
        create_tables(conn)
        
        # Insert sample data
        insert_sample_data(conn)
        
        print(f"✅ Database initialized: {db_path}")
        print("\n📊 Database Statistics:")
        
        cursor = conn.cursor()
        
        # Count records
        cursor.execute("SELECT COUNT(*) FROM assessments")
        assessments_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM feedback")
        feedback_count = cursor.fetchone()[0]
        
        print(f"  - Assessments: {assessments_count}")
        print(f"  - Feedback: {feedback_count}")
        
    finally:
        conn.close()
    
    print("\n✅ Database initialization complete!")


if __name__ == "__main__":
    main()
