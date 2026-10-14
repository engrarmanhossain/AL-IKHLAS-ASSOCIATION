@echo off
title Push AL-IKHLAS ASSOCIATION to GitHub
echo ================================================================
echo   Pushing AL-IKHLAS ASSOCIATION to GitHub Repository...
echo   https://github.com/engrarmanhossain/AL-IKHLAS-ASSOCIATION.git
echo ================================================================
echo.
cd /d "%~dp0"

echo Current Git Status:
git status
echo.
echo Pushing to main branch...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo   SUCCESS! Your repository is now live on GitHub!
    echo   https://github.com/engrarmanhossain/AL-IKHLAS-ASSOCIATION
    echo ================================================================
) else (
    echo.
    echo Push encountered an authentication request. 
    echo If prompted by GitHub, please sign in via browser or enter your token.
)

pause
