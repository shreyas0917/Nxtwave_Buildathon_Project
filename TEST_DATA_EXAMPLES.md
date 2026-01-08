# 📋 Test Data Examples for Advanced Features

## 🚀 Quick Start

1. **Generate Test Data**:
   ```bash
   cd backend
   python test_data/test_advanced_features.py
   ```

2. **View Generated Data**:
   - Check `backend/test_data/test_data.json`
   - All test data is saved there

## 📦 Batch Processing Test Data

### Example Request:
```json
{
  "images": [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8x...",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8x..."
  ],
  "animal_ids": ["TEST-ANI-001", "TEST-ANI-002", "TEST-ANI-003"],
  "region": "Gujarat"
}
```

### How to Test:
1. Go to `/batch` page
2. Use the base64 images from test_data.json
3. Or upload 3-5 real images
4. Click "Process Animals"

---

## 💡 Recommendations Test Data

### Test Case 1: High Risk
```json
{
  "breed": "Gir",
  "risk_level": "High",
  "visual_cues": ["Body Condition Score", "Eye/Nose Discharge"],
  "region": "Gujarat",
  "season": "summer"
}
```

### Test Case 2: Medium Risk
```json
{
  "breed": "Murrah",
  "risk_level": "Medium",
  "visual_cues": ["Coat Quality"],
  "region": "Punjab",
  "season": "monsoon"
}
```

### Test Case 3: Low Risk
```json
{
  "breed": "Sahiwal",
  "risk_level": "Low",
  "visual_cues": [],
  "region": "Haryana",
  "season": "winter"
}
```

### How to Test:
1. Go to `/recommendations` page
2. Fill in the form with above values
3. Click "Get Recommendations"
4. Should see prioritized recommendations

---

## 📄 Health Reports Test Data

### Example Request:
```json
{
  "animal_id": "TEST-ANI-001",
  "breed": "Gir",
  "assessments": [
    {
      "date": "2024-01-01T00:00:00",
      "risk_level": "Low",
      "confidence": 0.85,
      "breed": "Gir",
      "visual_cues": []
    },
    {
      "date": "2024-01-08T00:00:00",
      "risk_level": "Medium",
      "confidence": 0.75,
      "breed": "Gir",
      "visual_cues": ["Body Condition Score"]
    }
  ]
}
```

### How to Test:
1. Go to `/reports` page
2. Enter Animal ID: `TEST-ANI-001`
3. Enter Breed: `Gir`
4. Click "Generate Report"
5. Download PDF when ready

---

## 📱 QR Code Test Data

### Test Cases:
- **Animal ID**: `TEST-ANI-001`, **Breed**: `Gir`
- **Animal ID**: `TEST-ANI-002`, **Breed**: `Murrah`
- **Animal ID**: `TEST-ANI-003`, **Breed**: `null`

### How to Test:
1. Go to `/qrcode` page
2. Enter Animal ID: `TEST-ANI-001`
3. Enter Breed: `Gir` (optional)
4. Click "Generate QR Code"
5. Download and scan with phone

---

## 📊 Comparison Test Data

### Breed Comparison:
```json
{
  "comparison_type": "breed",
  "items": ["Gir", "Murrah", "Sahiwal", "Jaffarabadi"],
  "period": "last_30_days"
}
```

### Time Period Comparison:
```json
{
  "comparison_type": "time",
  "items": ["last_7_days", "last_30_days", "last_90_days"],
  "period": "last_30_days"
}
```

### Region Comparison:
```json
{
  "comparison_type": "region",
  "items": ["Gujarat", "Punjab", "Haryana"],
  "period": "last_30_days"
}
```

### How to Test:
1. Go to `/comparison` page
2. Select comparison type
3. Check 2-4 items
4. Click "Compare"
5. View chart and table

---

## 📈 Analytics Test Data

### Test Cases:
1. **State + District**: `state=Gujarat`, `district=Ahmedabad`, `period=last_30_days`
2. **State Only**: `state=Punjab`, `period=last_7_days`
3. **All Data**: `period=last_90_days`

### How to Test:
1. Go to `/analytics` page
2. Select filters
3. View KPI cards and charts

---

## 🔔 Notification Test Data

### Trigger High Risk Alert:
1. Go to `/risk` page
2. Upload an image
3. If result is "High", notification appears automatically

### Manual Trigger (Browser Console):
```javascript
// High Risk Alert
window.dispatchEvent(new CustomEvent('high-risk-detected', {
  detail: { risk_level: 'High', confidence: 0.75 }
}))

// Batch Complete
window.dispatchEvent(new CustomEvent('batch-complete', {
  detail: { count: 5 }
}))
```

---

## 📅 Historical Tracking Test Data

### Sample Data:
```json
{
  "animal_id": "TEST-ANI-001",
  "history": [
    {
      "date": "2025-11-08",
      "risk_level": "Medium",
      "confidence": 0.79,
      "breed": "Gir",
      "visual_cues": []
    },
    {
      "date": "2025-11-11",
      "risk_level": "Medium",
      "confidence": 0.77,
      "breed": "Gir",
      "visual_cues": ["Coat Quality"]
    }
  ]
}
```

---

## 🎯 Complete Test Flow

### 5-Minute Test:
1. **Batch** (1 min): Upload 3 images → Process → Check results
2. **Risk** (30s): Upload 1 image → Get High risk → See notification
3. **Recommendations** (30s): Enter High risk → Get recommendations
4. **Reports** (30s): Generate report → Download PDF
5. **QR Code** (30s): Generate QR → Download
6. **Comparison** (1 min): Compare 3 breeds → View chart
7. **Analytics** (1 min): View dashboard → Check KPIs

---

## 📝 Quick Reference

### Animal IDs:
- `TEST-ANI-001` through `TEST-ANI-005`

### Breeds:
- `Gir`, `Murrah`, `Sahiwal`, `Jaffarabadi`, `Tharparkar`, `Kankrej`

### Regions:
- `Gujarat`, `Punjab`, `Haryana`, `Rajasthan`, `Maharashtra`

### Risk Levels:
- `Low`, `Medium`, `High`

### Visual Cues:
- `Body Condition Score`
- `Coat Quality`
- `Eye/Nose Discharge`

---

## 🧪 Creating Test Images

### Browser Console Method:
```javascript
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red'; // Change color
ctx.fillRect(0, 0, 256, 256);
const imgData = canvas.toDataURL('image/png');
console.log(imgData); // Use this in batch processing
```

### Python Method:
```python
from PIL import Image
import io
import base64

img = Image.new('RGB', (256, 256), color='red')
buffer = io.BytesIO()
img.save(buffer, format='PNG')
base64_image = base64.b64encode(buffer.getvalue()).decode()
print(f"data:image/png;base64,{base64_image}")
```

---

## ✅ Test Checklist

- [ ] Batch Processing: Process 5 images successfully
- [ ] Recommendations: Get recommendations for all risk levels
- [ ] Health Reports: Generate and download PDF
- [ ] QR Codes: Generate and scan QR code
- [ ] Comparison: Compare breeds/time periods/regions
- [ ] Analytics: View KPIs and trend charts
- [ ] Notifications: See alerts for high risk and batch complete
- [ ] Historical Tracking: View animal history (if implemented)

---

## 🐛 Troubleshooting

**Test data not generating?**
- Check Python path
- Ensure PIL/Pillow is installed: `pip install Pillow`

**API errors?**
- Check backend is running: `python backend/start.py`
- Check CORS settings
- Verify API endpoint URLs

**Frontend errors?**
- Check frontend is running: `npm run dev`
- Clear browser cache
- Check browser console for errors

---

All test data is saved in: `backend/test_data/test_data.json`

Happy Testing! 🚀

