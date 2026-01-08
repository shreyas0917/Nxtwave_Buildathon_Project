# 🚀 Quick Start: Test Data for Advanced Features

## Step 1: Generate Test Data

```bash
cd backend
python test_data/test_advanced_features.py
```

This will create `backend/test_data/test_data.json` with all test data.

## Step 2: Test Each Feature

### 📦 Batch Processing
**Frontend**: Go to `/batch` → Upload 3-5 images → Process

**API Test**:
```bash
curl -X POST http://localhost:8000/api/v1/batch-assess \
  -H "Content-Type: application/json" \
  -d @backend/test_data/batch_test.json
```

### 💡 Recommendations
**Frontend**: Go to `/recommendations` → Fill form:
- Risk Level: **High**
- Visual Cues: Check "Body Condition Score"
- Breed: **Gir**

**API Test**:
```bash
curl -X POST http://localhost:8000/api/v1/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "risk_level": "High",
    "visual_cues": ["Body Condition Score"],
    "breed": "Gir"
  }'
```

### 📄 Health Reports
**Frontend**: Go to `/reports` → Enter Animal ID → Generate → Download PDF

**API Test**:
```bash
curl -X POST http://localhost:8000/api/v1/generate-report \
  -H "Content-Type: application/json" \
  -d @backend/test_data/report_test.json
```

### 📱 QR Codes
**Frontend**: Go to `/qrcode` → Enter Animal ID: `TEST-ANI-001` → Generate → Download

**API Test**:
```bash
curl http://localhost:8000/api/v1/generate-qr/TEST-ANI-001?breed=Gir \
  --output qr_code.png
```

### 📊 Comparison
**Frontend**: Go to `/comparison` → Select "Breed" → Check Gir, Murrah, Sahiwal → Compare

**API Test**:
```bash
curl -X POST http://localhost:8000/api/v1/compare \
  -H "Content-Type: application/json" \
  -d '{
    "comparison_type": "breed",
    "items": ["Gir", "Murrah", "Sahiwal"],
    "period": "last_30_days"
  }'
```

### 📈 Analytics
**Frontend**: Go to `/analytics` → Select State: Gujarat → View KPIs and Charts

**API Test**:
```bash
curl "http://localhost:8000/api/v1/health-trends?state=Gujarat&period=last_30_days"
```

## Step 3: Create Test Images

### Quick Method (Browser Console):
```javascript
// Create test image
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
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

## Step 4: Test Notifications

### Trigger High Risk Alert:
1. Go to `/risk`
2. Upload an image
3. If result is "High", notification appears

### Manual Trigger (Browser Console):
```javascript
window.dispatchEvent(new CustomEvent('high-risk-detected', {
  detail: { risk_level: 'High', confidence: 0.75 }
}))
```

## 📋 Complete Test Checklist

- [ ] Batch Processing: Process 5 images
- [ ] Recommendations: Get High/Medium/Low risk recommendations
- [ ] Health Reports: Generate and download PDF
- [ ] QR Codes: Generate and scan QR code
- [ ] Comparison: Compare breeds/time periods/regions
- [ ] Analytics: View KPIs and trend charts
- [ ] Notifications: See alerts for high risk and batch complete

## 🎯 Quick Test Flow (5 minutes)

1. **Batch**: Upload 3 images → Process → Check results
2. **Risk**: Upload 1 image → Get High risk → See notification
3. **Recommendations**: Enter High risk → Get recommendations
4. **Reports**: Generate report → Download PDF
5. **QR Code**: Generate QR → Download image
6. **Comparison**: Compare 3 breeds → View chart
7. **Analytics**: View dashboard → Check KPIs

## 📝 Sample Test Data

All test data is in: `backend/test_data/test_data.json`

Key test values:
- **Animal IDs**: TEST-ANI-001, TEST-ANI-002, etc.
- **Breeds**: Gir, Murrah, Sahiwal, Jaffarabadi
- **Regions**: Gujarat, Punjab, Haryana
- **Risk Levels**: Low, Medium, High

## 🐛 Troubleshooting

**Backend not starting?**
```bash
cd backend
pip install reportlab qrcode
python start.py
```

**Frontend errors?**
```bash
cd frontend
npm install
npm run dev
```

**API errors?**
- Check backend is running on port 8000
- Check CORS settings
- Check API endpoint URLs

## ✅ Success Indicators

- ✅ All pages load without errors
- ✅ API calls return 200 status
- ✅ Data displays correctly
- ✅ PDFs generate successfully
- ✅ QR codes scan correctly
- ✅ Notifications appear
- ✅ Charts render properly

Happy Testing! 🚀

