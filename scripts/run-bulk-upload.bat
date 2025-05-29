@echo off
echo ASA Web Gallery Bulk Upload Tool
echo ===============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Node.js is not installed or not in your PATH.
  echo Please install Node.js from https://nodejs.org/
  exit /b 1
)

REM Check if required modules are installed
echo Checking for required npm modules...
cd /d "%~dp0"
cd ..

if not exist node_modules\axios (
  echo Installing required modules...
  call npm install axios form-data --save-dev
)

REM Create images-to-upload directory if it doesn't exist
if not exist "%~dp0..\images-to-upload" (
  echo Creating images-to-upload directory...
  mkdir "%~dp0..\images-to-upload"
  echo Please place your images in the newly created 'images-to-upload' folder.
  echo Then run this script again.
  pause
  exit /b 0
)

REM Check if there are images in the folder
dir /b "%~dp0..\images-to-upload\*.jpg" "%~dp0..\images-to-upload\*.jpeg" "%~dp0..\images-to-upload\*.png" "%~dp0..\images-to-upload\*.gif" 2>nul | find /v "" >nul
if %ERRORLEVEL% neq 0 (
  echo No images found in the 'images-to-upload' folder.
  echo Please add your images to the folder and run this script again.
  pause
  exit /b 0
)

REM Check if configuration file exists
if not exist "%~dp0\bulk-upload-config.js" (
  echo Configuration file not found.
  echo Creating from example...
  copy "%~dp0\bulk-upload-config.example.js" "%~dp0\bulk-upload-config.js"
  echo Please edit the configuration file:
  echo %~dp0\bulk-upload-config.js
  echo Set your admin email, password, and other options.
  echo Then run this script again.
  pause
  exit /b 0
)

echo Running bulk upload script...
echo.
node "%~dp0\bulkUploadToGallery.js"

echo.
echo Bulk upload completed.
pause 