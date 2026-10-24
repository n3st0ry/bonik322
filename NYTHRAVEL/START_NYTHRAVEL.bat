@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Установите Node.js LTS 20 или новее: https://nodejs.org/
  pause
  exit /b 1
)
node "%~dp0launch.js"
if errorlevel 1 pause
