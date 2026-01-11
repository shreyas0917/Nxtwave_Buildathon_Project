# 🧹 Final Cleanup Instructions

Due to locked files (node_modules), please follow these manual steps to complete the cleanup:

## ✅ Completed Automatically

1. ✅ Deleted `deployment thing/` folder
2. ✅ Created API service file in `saeecattle/src/services/api.ts`
3. ✅ Updated `saeecattle/vite.config.ts` (port 3000, proxy to backend)
4. ✅ Updated `saeecattle/src/contexts/ScanContext.tsx` (connected to backend API)
5. ✅ Updated backend CORS settings

## 📋 Manual Steps Required

### Step 1: Stop Any Running Servers

Close all terminals running frontend/backend servers.

### Step 2: Replace Frontend with saeecattle

**Option A: Using File Explorer (Easier)**
1. Close all terminals and IDEs
2. In File Explorer, navigate to `D:\NXTWAVE_OPENAI_PROJECT`
3. Delete the `frontend` folder (or rename it to `frontend_old_backup`)
4. Rename `saeecattle` folder to `frontend`

**Option B: Using PowerShell (After closing servers)**
```powershell
cd D:\NXTWAVE_OPENAI_PROJECT

# Rename old frontend
Rename-Item -Path "frontend" -NewName "frontend_old_backup"

# Rename saeecattle to frontend
Rename-Item -Path "saeecattle" -NewName "frontend"
```

### Step 3: Install Dependencies

```bash
cd frontend
npm install
```

### Step 4: Create Environment File (Optional)

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:8000/api/v1
```

### Step 5: Verify Structure

The `frontend` folder should now have:
- `src/services/api.ts` ✅ (already created)
- `src/contexts/ScanContext.tsx` ✅ (already updated)
- `vite.config.ts` ✅ (already updated)
- `package.json` ✅
- All other saeecattle files ✅

### Step 6: Test the Setup

**Terminal 1 - Backend:**
```bash
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🗑️ Optional: Clean Up Old Files

After verifying everything works:

1. **Delete old frontend backup** (if everything works):
   ```powershell
   Remove-Item -Path "frontend_old_backup" -Recurse -Force
   ```

2. **Delete other unused folders** (optional):
   - `Nxtwave_Buildathon_Project/` (if not needed)
   - `services/` (empty folder at root)

## ✅ Final Project Structure

```
NXTWAVE_OPENAI_PROJECT/
├── backend/              # FastAPI Backend
│   ├── app/
│   ├── data/
│   └── ...
├── frontend/             # New React TypeScript UI (renamed from saeecattle)
│   ├── src/
│   │   ├── services/    # API client
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── scripts/              # Startup scripts
├── docs/                 # Documentation
└── README.md
```

## 🎯 What's Been Done

- ✅ **Backend**: Unchanged, fully functional
- ✅ **Frontend**: New React TypeScript UI from saeecattle
- ✅ **API Integration**: Connected to backend endpoints
- ✅ **Detection**: Now uses real backend API instead of mock data
- ✅ **CORS**: Updated to allow new frontend
- ✅ **Port**: Changed from 8080 to 3000 (standard)

## 📚 Next Steps

1. Test breed identification with real images
2. Test risk assessment
3. Connect other pages (Dashboard, Reports) to backend APIs if needed
4. Remove old backup folders after verification
