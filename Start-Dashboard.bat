@echo off
title AL-IKHLAS ASSOCIATION - Dashboard Launcher
echo ========================================================
echo   Launching AL-IKHLAS ASSOCIATION Real-Time Dashboard...
echo ========================================================
echo.
cd /d "%~dp0"

REM Try launching with Python server if python is available
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting local web server...
    python server.py
) else (
    REM Fallback: Open index.html directly in default browser
    echo Opening dashboard in default web browser...
    start index.html
)
pause
