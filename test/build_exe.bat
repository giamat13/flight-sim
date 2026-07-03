@echo off
setlocal enabledelayedexpansion

:: Request administrator privileges if not already running as admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process -FilePath '%~f0' -Verb RunAs -WorkingDirectory '%~dp0'"
    exit /b
)

cd /d "%~dp0"

:: Build OUTSIDE the workspace to avoid EPERM locks from VSCode/Defender file watchers
set "FLIGHTSIM_OUT=%USERPROFILE%\flightsim-build"

echo ================================================
echo  Flight Simulator - Desktop EXE Builder
echo ================================================
echo.

echo [1/4] Installing Electron dependencies...
call npm install --save-dev electron electron-builder
if !errorlevel! neq 0 (
  echo ERROR: Failed to install dependencies.
  pause
  exit /b 1
)
echo Done.
echo.

echo [2/4] Verifying files...
if not exist "electron\main.cjs" (
  echo ERROR: electron\main.cjs not found.
  pause
  exit /b 1
)
if not exist "public\simulator.html" (
  echo ERROR: public\simulator.html not found.
  pause
  exit /b 1
)
echo OK.
echo.

echo [3/4] Cleaning previous build...
if exist "%FLIGHTSIM_OUT%" (
  rmdir /s /q "%FLIGHTSIM_OUT%"
  echo Cleaned "%FLIGHTSIM_OUT%".
)
echo.

echo [4/4] Building EXE installer...
echo Output folder: %FLIGHTSIM_OUT%
call npx electron-builder --win --x64 --config electron-builder.yml
if !errorlevel! neq 0 (
  echo ERROR: electron-builder failed.
  pause
  exit /b 1
)

echo.
echo ================================================
echo  Build complete!
echo  Installer: %FLIGHTSIM_OUT%\FlightSimulator-Setup.exe
echo ================================================
echo.
echo Opening output folder...
explorer "%FLIGHTSIM_OUT%"
pause
