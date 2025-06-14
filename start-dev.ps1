# CampusKarma Development Server Startup Script
Write-Host "🚀 Starting CampusKarma Development Servers..." -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "📡 Starting Backend Server (Port 5000)..." -ForegroundColor Blue
$backendPath = Join-Path $scriptDir "backend"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev" -WindowStyle Normal

Write-Host "🌐 Starting Frontend Server (Port 5173)..." -ForegroundColor Cyan
$frontendPath = Join-Path $scriptDir "frontend"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Both servers are starting in separate windows" -ForegroundColor Green
Write-Host "📡 Backend: http://localhost:5000" -ForegroundColor Blue
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Development URLs:" -ForegroundColor Yellow
Write-Host "   - Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   - Backend API: http://localhost:5000/api/v1" -ForegroundColor White
Write-Host "   - Health Check: http://localhost:5000/api/v1/health" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
