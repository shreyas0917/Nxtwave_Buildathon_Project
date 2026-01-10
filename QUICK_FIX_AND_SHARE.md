# 🚀 Quick Fix & Share Datasets

## ✅ Status

- **Datasets compressed**: ✅ `datasets.tar.gz` (853 MB) created
- **Location**: `Nxtwave_Buildathon_Project/backend/datasets.tar.gz`
- **Git issue**: Nested .git repository causing conflicts

---

## 🔧 Step 1: Fix Git Issue

```bash
cd /home/darshan/NXTWave_Hackthon

# Remove nested .git (fixes submodule conflict)
rm -rf Nxtwave_Buildathon_Project/.git

# Add files normally
git add Nxtwave_Buildathon_Project/
git commit -m "Add project files"
git push origin devD
```

---

## 📤 Step 2: Upload Datasets

### **Option A: Google Drive (Recommended)**

1. Go to https://drive.google.com
2. Click **New** → **File upload**
3. Upload: `Nxtwave_Buildathon_Project/backend/datasets.tar.gz`
4. Right-click uploaded file → **Share** → **Get link**
5. Copy link and share with team

### **Option B: Dropbox**

1. Go to https://dropbox.com
2. Upload `datasets.tar.gz`
3. Get shareable link
4. Share with team

---

## 👥 Step 3: Share with Team

Send team members:
1. **Download link** (from Google Drive/Dropbox)
2. **Instructions**:
   ```bash
   # Download datasets.tar.gz
   # Extract to:
   cd Nxtwave_Buildathon_Project/backend
   tar -xzf datasets.tar.gz
   
   # Verify:
   bash setup_datasets.sh
   ```

---

## 📋 Quick Commands

```bash
# Fix Git
cd /home/darshan/NXTWave_Hackthon
rm -rf Nxtwave_Buildathon_Project/.git
git add Nxtwave_Buildathon_Project/
git commit -m "Add project files"
git push origin devD

# Datasets already compressed at:
# Nxtwave_Buildathon_Project/backend/datasets.tar.gz (853 MB)
# Upload this file to Google Drive and share link
```

---

**Your datasets are ready to share! 🎉**
