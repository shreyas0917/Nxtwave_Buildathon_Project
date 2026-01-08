# PowerShell script to start backend with venv
Set-Location $PSScriptRoot
& ".\venv\Scripts\Activate.ps1"
python start.py

