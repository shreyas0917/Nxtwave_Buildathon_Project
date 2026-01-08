# 🧪 Quick Test Guide - Advanced Features

## ✅ Test Data Generated!

All test data is saved in: `backend/test_data/test_data.json`

## 🚀 Quick Start Testing

### 1. Start Backend
```bash
cd backend
python start.py
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Each Feature

---

## 📦 **Batch Processing** (`/batch`)

**Test Data:**
- 5 base64 encoded test images (red, green, blue, yellow, orange)
- Animal IDs: TEST-ANI-001 through TEST-ANI-005

**How to Test:**
1. Go to `/batch` page
2. Copy images from `test_data.json` → `batch_processing.images`
3. Paste into frontend or use Postman
4. Click "Process Animals"

**Expected:** Results table with breed, risk level, confidence for each animal

---

## 💡 **Recommendations** (`/recommendations`)

**Test Cases:**

### High Risk:
```json
{
  "breed": "Gir",
  "risk_level": "High",
  "visual_cues": ["Body Condition Score", "Eye/Nose Discharge"],
  "region": "Gujarat"
}
```

### Medium Risk:
```json
{
  "breed": "Murrah",
  "risk_level": "Medium",
  "visual_cues": ["Coat Quality"],
  "region": "Punjab"
}
```

### Low Risk:
```json
{
  "breed": "Sahiwal",
  "risk_level": "Low",
  "visual_cues": [],
  "region": "Haryana"
}
```

**How to Test:**
1. Go to `/recommendations` page
2. Fill form with above values
3. Click "Get Recommendations"

**Expected:** Prioritized recommendations with categories (Medical, Nutrition, Seasonal, etc.)

---

## 📄 **Health Reports** (`/reports`)

**Test Data:**
- Animal ID: `TEST-ANI-001`
- Breed: `Gir`
- 10 sample assessments (from test_data.json)

**How to Test:**
1. Go to `/reports` page
2. Enter Animal ID: `TEST-ANI-001`
3. Enter Breed: `Gir`
4. Click "Generate Report"
5. Download PDF

**Expected:** PDF with assessment history, summary, recommendations

---

## 📱 **QR Codes** (`/qrcode`)

**Test Cases:**
- Animal ID: `TEST-ANI-001`, Breed: `Gir`
- Animal ID: `TEST-ANI-002`, Breed: `Murrah`
- Animal ID: `TEST-ANI-003`, Breed: `null`

**How to Test:**
1. Go to `/qrcode` page
2. Enter Animal ID: `TEST-ANI-001`
3. Enter Breed: `Gir` (optional)
4. Click "Generate QR Code"
5. Download and scan with phone

**Expected:** QR code image that scans to JSON with animal info

---

## 📊 **Comparison** (`/comparison`)

**Test Cases:**

### Breed Comparison:
- Items: `["Gir", "Murrah", "Sahiwal", "Jaffarabadi"]`
- Period: `last_30_days`

### Time Period Comparison:
- Items: `["last_7_days", "last_30_days", "last_90_days"]`
- Period: `last_30_days`

### Region Comparison:
- Items: `["Gujarat", "Punjab", "Haryana"]`
- Period: `last_30_days`

**How to Test:**
1. Go to `/comparison` page
2. Select comparison type
3. Check 2-4 items
4. Click "Compare"

**Expected:** Comparison chart, table, and key insights

---

## 📈 **Analytics** (`/analytics`)

**Test Cases:**
1. State: `Gujarat`, District: `Ahmedabad`, Period: `last_30_days`
2. State: `Punjab`, Period: `last_7_days`
3. All data: Period: `last_90_days`

**How to Test:**
1. Go to `/analytics` page
2. Select filters
3. View KPIs and charts

**Expected:** 4 KPI cards, trend charts, summary statistics

---

## 🔔 **Notifications**

**How to Test:**
1. Go to `/risk` page
2. Upload an image
3. If result is "High", notification appears automatically

**Or Manual Test (Browser Console):**
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

**Expected:** Notification appears in top-right corner

---

## 📅 **Historical Tracking**

**Test Data:**
- Animal ID: `TEST-ANI-001`
- 20 historical records (from test_data.json)

**How to Test:**
1. Go to `/history` page (if implemented)
2. Enter Animal ID: `TEST-ANI-001`
3. View historical chart

**Expected:** Line chart showing confidence over time

---

## 🎯 **5-Minute Complete Test**

1. **Batch** (1 min): Upload 3 images → Process → Check results
2. **Risk** (30s): Upload image → Get High risk → See notification
3. **Recommendations** (30s): Enter High risk → Get recommendations
4. **Reports** (30s): Generate report → Download PDF
5. **QR Code** (30s): Generate QR → Download
6. **Comparison** (1 min): Compare 3 breeds → View chart
7. **Analytics** (1 min): View dashboard → Check KPIs

---

## 📝 **Quick Reference**

### Animal IDs:
- `TEST-ANI-001`, `TEST-ANI-002`, `TEST-ANI-003`, `TEST-ANI-004`, `TEST-ANI-005`

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

## 🧪 **Create Test Images**

### Browser Console:
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

### Python:
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

## ✅ **Test Checklist**

- [ ] Batch Processing: Process 5 images
- [ ] Recommendations: Test High/Medium/Low risk
- [ ] Health Reports: Generate and download PDF
- [ ] QR Codes: Generate and scan QR code
- [ ] Comparison: Compare breeds/time periods/regions
- [ ] Analytics: View KPIs and trend charts
- [ ] Notifications: See high-risk and batch-complete alerts
- [ ] Historical Tracking: View animal history

---

## 📂 **Files Created**

1. `backend/test_data/test_advanced_features.py` - Test data generator
2. `backend/test_data/test_data.json` - All test data (generated)
3. `backend/test_data/TESTING_GUIDE.md` - Detailed testing guide
4. `TEST_DATA_QUICK_START.md` - Quick start guide
5. `TEST_DATA_EXAMPLES.md` - Examples and reference
6. `QUICK_TEST_GUIDE.md` - This file

---

## 🐛 **Troubleshooting**

**Backend not starting?**
```bash
cd backend
pip install reportlab qrcode
python start.py
```

**Test data not generating?**
- Check you're in `backend` directory
- Ensure PIL/Pillow is installed: `pip install Pillow`

**API errors?**
- Check backend is running on port 8000
- Check CORS settings
- Verify API endpoint URLs

---

All test data is ready! Start testing now! 🚀

