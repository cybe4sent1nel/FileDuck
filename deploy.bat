@echo off
REM Render Deployment Batch Script
REM Usage: deploy.bat YOUR_API_KEY

if "%1"=="" (
    echo Usage: deploy.bat YOUR_API_KEY
    echo.
    echo Get API key from: https://dashboard.render.com/account/api-tokens
    exit /b 1
)

setlocal enabledelayedexpansion
set SERVICE_ID=srv-d65vqkkr85hc73d2t050
set API_KEY=%1

echo Deploying FileDuck API to Render...
echo Service ID: %SERVICE_ID%
echo.

curl -X POST "https://api.render.com/v1/services/%SERVICE_ID%/deploys" ^
  -H "Authorization: Bearer %API_KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{}"

echo.
echo Deployment triggered!
echo Check status at: https://dashboard.render.com/services/%SERVICE_ID%
