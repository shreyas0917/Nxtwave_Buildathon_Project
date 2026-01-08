# 🧪 Testing Guide for Advanced Features

## Quick Start

1. **Generate Test Data**:
   ```bash
   cd backend
   python test_data/test_advanced_features.py
   ```

2. **Start Backend**:
   ```bash
   python start.py
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## 📦 Batch Processing Test

### Using Frontend:
1. Navigate to `/batch`
2. Click "Select Multiple Images"
3. Select 3-5 test images (or use the generated test images)
4. Click "Process Animals"
5. View results table

### Using API (Postman/cURL):
```bash
POST http://localhost:8000/api/v1/batch-assess
Content-Type: application/json

{
  "images": [
    "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "data:image/png;base64,iVBORw0KGgoAAAANS..."
  ],
  "animal_ids": ["ANI-001", "ANI-002"],
  "region": "Gujarat"
}
```

### Expected Result:
- Success count: Number of successfully processed images
- Error count: Number of failed images
- Results table with breed, risk level, confidence for each

---

## 💡 Recommendations Test

### Using Frontend:
1. Navigate to `/recommendations`
2. Fill in the form:
   - Breed: "Gir" (optional)
   - Risk Level: "High" (required)
   - Visual Cues: Check "Body Condition Score" and "Eye/Nose Discharge"
   - Region: "Gujarat" (optional)
3. Click "Get Recommendations"
4. View prioritized recommendations

### Using API:
```bash
POST http://localhost:8000/api/v1/recommendations
Content-Type: application/json

{
  "breed": "Gir",
  "risk_level": "High",
  "visual_cues": ["Body Condition Score", "Eye/Nose Discharge"],
  "region": "Gujarat",
  "season": "summer"
}
```

### Test Cases:
1. **High Risk**: Should show high-priority medical recommendations
2. **Medium Risk**: Should show preventive care recommendations
3. **Low Risk**: Should show general maintenance recommendations

---

## 📄 Health Reports Test

### Using Frontend:
1. Navigate to `/reports`
2. Enter Animal ID: "TEST-ANI-001" (optional)
3. Enter Breed: "Gir" (optional)
4. Click "Generate Report"
5. Download PDF when ready

### Using API:
```bash
POST http://localhost:8000/api/v1/generate-report
Content-Type: application/json

{
  "animal_id": "TEST-ANI-001",
  "breed": "Gir",
  "assessments": [
    {
      "date": "2024-01-01T00:00:00",
      "risk_level": "Low",
      "confidence": 0.85,
      "breed": "Gir"
    }
  ]
}
```

### Download Report:
```bash
GET http://localhost:8000/api/v1/download-report/{report_id}
```

### Expected Result:
- PDF file with:
  - Report metadata
  - Executive summary
  - Assessment history table
  - Recommendations section
  - Disclaimer

---

## 📱 QR Code Test

### Using Frontend:
1. Navigate to `/qrcode`
2. Enter Animal ID: "TEST-ANI-001"
3. Enter Breed: "Gir" (optional)
4. Click "Generate QR Code"
5. Download QR code image

### Using API:
```bash
GET http://localhost:8000/api/v1/generate-qr/TEST-ANI-001?breed=Gir
```

### Expected Result:
- PNG image of QR code
- QR code contains: animal_id, breed, platform info, URL

### Test QR Code:
- Scan with phone camera
- Should decode to JSON with animal information

---

## 📊 Comparison Test

### Using Frontend:
1. Navigate to `/comparison`
2. Select Comparison Type: "Breed"
3. Select Period: "Last 30 Days"
4. Check 2-4 breeds: Gir, Murrah, Sahiwal
5. Click "Compare"
6. View comparison chart and table

### Using API:
```bash
POST http://localhost:8000/api/v1/compare
Content-Type: application/json

{
  "comparison_type": "breed",
  "items": ["Gir", "Murrah", "Sahiwal"],
  "period": "last_30_days"
}
```

### Test Cases:
1. **Breed Comparison**: Compare 3-4 different breeds
2. **Time Period Comparison**: Compare last_7_days, last_30_days, last_90_days
3. **Region Comparison**: Compare different states/districts

### Expected Result:
- Comparison chart (bar chart)
- Detailed comparison table
- Key insights list

---

## 📈 Analytics Test

### Using Frontend:
1. Navigate to `/analytics`
2. Select filters:
   - State: "Gujarat" (optional)
   - District: "Ahmedabad" (optional)
   - Period: "Last 30 Days"
3. View KPI cards and charts

### Using API:
```bash
GET http://localhost:8000/api/v1/health-trends?state=Gujarat&district=Ahmedabad&period=last_30_days
```

### Expected Result:
- 4 KPI cards: Total, Low Risk %, Medium Risk %, High Risk %
- Trend chart showing risk distribution over time
- Summary statistics

---

## 📅 Historical Tracking Test

### Using Frontend:
1. Navigate to `/history` (if route exists)
2. Enter Animal ID: "TEST-ANI-001"
3. View historical chart

### Test Data:
Use the generated historical tracking data from test script.

### Expected Result:
- Line chart showing confidence over time
- Historical assessment records
- Trend analysis

---

## 🔔 Notifications Test

### Trigger High Risk Notification:
1. Navigate to `/risk`
2. Upload an image
3. If result is "High" risk, notification should appear

### Trigger Batch Complete Notification:
1. Navigate to `/batch`
2. Process multiple images
3. Notification should appear when complete

### Manual Test (Browser Console):
```javascript
// Trigger high risk notification
window.dispatchEvent(new CustomEvent('high-risk-detected', {
  detail: { risk_level: 'High', confidence: 0.75 }
}))

// Trigger batch complete notification
window.dispatchEvent(new CustomEvent('batch-complete', {
  detail: { count: 5 }
}))
```

### Expected Result:
- Notification appears in top-right corner
- Auto-dismisses after 5-10 seconds
- Can be manually closed

---

## 🧪 Complete Test Flow

### End-to-End Test:
1. **Breed Identification** → Get breed
2. **Risk Assessment** → Get risk level (trigger notification if High)
3. **Get Recommendations** → Use breed and risk level
4. **Generate Report** → Include assessment data
5. **Generate QR Code** → Use animal ID and breed
6. **Batch Process** → Process multiple animals
7. **Compare** → Compare breeds or regions
8. **View Analytics** → Check trends and KPIs

---

## 📝 Test Checklist

- [ ] Batch Processing: Process 5 images successfully
- [ ] Recommendations: Get recommendations for High/Medium/Low risk
- [ ] Health Reports: Generate and download PDF
- [ ] QR Codes: Generate and scan QR code
- [ ] Comparison: Compare breeds, time periods, regions
- [ ] Analytics: View KPIs and charts
- [ ] Notifications: See high-risk and batch-complete alerts
- [ ] Historical Tracking: View animal history (if implemented)

---

## 🐛 Troubleshooting

### Batch Processing Fails:
- Check image format (PNG/JPEG)
- Verify image size (< 10MB)
- Check backend logs for errors

### Reports Not Generating:
- Ensure `reportlab` is installed: `pip install reportlab`
- Check `backend/reports` directory exists
- Verify assessment data format

### QR Codes Not Working:
- Ensure `qrcode` is installed: `pip install qrcode`
- Check animal ID format
- Verify QR code scanner app

### Notifications Not Showing:
- Check browser console for errors
- Verify NotificationSystem component is mounted
- Check event names match

---

## 📊 Sample Test Images

You can create test images using:
```python
from PIL import Image
import io
import base64

# Create a red test image
img = Image.new('RGB', (256, 256), color='red')
buffer = io.BytesIO()
img.save(buffer, format='PNG')
base64_image = base64.b64encode(buffer.getvalue()).decode()
print(f"data:image/png;base64,{base64_image}")
```

Use different colors for different test cases:
- Red: High risk
- Green: Low risk
- Yellow: Medium risk

---

## ✅ Success Criteria

All features should:
1. ✅ Load without errors
2. ✅ Process requests successfully
3. ✅ Return expected data format
4. ✅ Display results correctly
5. ✅ Handle errors gracefully
6. ✅ Work offline (where applicable)

Good luck testing! 🚀

