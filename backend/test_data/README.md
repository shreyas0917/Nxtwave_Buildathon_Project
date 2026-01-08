# Test Data for Advanced Features

## 📋 Overview

This directory contains test data and scripts for testing all advanced features.

## 🚀 Quick Start

### Generate Test Data:
```bash
cd backend
python test_data/test_advanced_features.py
```

This creates `test_data.json` with all test data.

## 📁 Files

- `test_advanced_features.py` - Test data generator script
- `test_data.json` - Generated test data (run script to create)
- `TESTING_GUIDE.md` - Detailed testing instructions
- `README.md` - This file

## 📊 Test Data Includes

1. **Batch Processing**: 5 base64 encoded test images
2. **Recommendations**: 3 test cases (High/Medium/Low risk)
3. **Health Reports**: 10 sample assessments
4. **Comparison**: Breed, time period, and region comparisons
5. **QR Codes**: 3 test cases
6. **Analytics**: 3 filter combinations
7. **Historical Tracking**: 20 historical records
8. **Notifications**: 3 notification examples

## 🧪 Using Test Data

### Option 1: Use Generated JSON
- Open `test_data.json`
- Copy relevant sections
- Use in frontend or Postman

### Option 2: Use Test Script
- Run the Python script
- Copy output from console
- Use directly in API calls

### Option 3: Use Frontend
- Navigate to feature pages
- Use test values from this guide
- Test interactively

## 📝 Test Values Reference

### Animal IDs:
- TEST-ANI-001, TEST-ANI-002, TEST-ANI-003, TEST-ANI-004, TEST-ANI-005

### Breeds:
- Gir, Murrah, Sahiwal, Jaffarabadi, Tharparkar, Kankrej

### Regions:
- Gujarat, Punjab, Haryana, Rajasthan, Maharashtra

### Risk Levels:
- Low, Medium, High

## ✅ Success Criteria

All features should:
- Load without errors
- Process requests successfully
- Return expected data format
- Display results correctly
- Handle errors gracefully

Happy Testing! 🚀

