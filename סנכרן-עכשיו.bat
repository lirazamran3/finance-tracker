@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File sync-now.ps1
