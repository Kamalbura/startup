@echo off
echo 🚀 Starting CampusKarma Development Servers...
echo.

echo 📡 Starting Backend Server (Port 5000)...
cd /d "%~dp0backend"
start "CampusKarma Backend" cmd /k "npm run dev"

echo 🌐 Starting Frontend Server (Port 5173)...
cd /d "%~dp0frontend"  
start "CampusKarma Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting in separate windows
echo 📡 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
