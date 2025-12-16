# AkaMoney Cloudflare Development Environment Script
# This script starts both the Cloudflare Workers API and Vue frontend for local development

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AkaMoney - Cloudflare Dev Environment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script's directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$WorkerDir = Join-Path $ScriptDir "worker"
$FrontendDir = Join-Path $ScriptDir "..\akamoney-frontend"

# Check if wrangler is installed
if (-not (Get-Command "wrangler" -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Wrangler CLI not found. Installing globally..." -ForegroundColor Yellow
    npm install -g wrangler
}

# Check if worker dependencies are installed
if (-not (Test-Path (Join-Path $WorkerDir "node_modules"))) {
    Write-Host "[*] Installing worker dependencies..." -ForegroundColor Yellow
    Push-Location $WorkerDir
    npm install
    Pop-Location
}

# Check if frontend dependencies are installed
if (-not (Test-Path (Join-Path $FrontendDir "node_modules"))) {
    Write-Host "[*] Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location $FrontendDir
    npm install
    Pop-Location
}

# Check for .dev.vars file
$DevVarsFile = Join-Path $WorkerDir ".dev.vars"
if (-not (Test-Path $DevVarsFile)) {
    Write-Host "[!] .dev.vars file not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item (Join-Path $WorkerDir ".dev.vars.example") $DevVarsFile
    Write-Host "[!] Please edit $DevVarsFile with your Azure Entra ID credentials" -ForegroundColor Red
    Write-Host ""
}

# Initialize D1 database if needed
Write-Host "[*] Setting up local D1 database..." -ForegroundColor Yellow
Push-Location $WorkerDir
try {
    # Run migration
    npm run db:migrate 2>$null
    Write-Host "[OK] D1 database ready" -ForegroundColor Green
} catch {
    Write-Host "[!] D1 migration warning (may be first run): $_" -ForegroundColor Yellow
}
Pop-Location

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Cyan
Write-Host "  - Workers API: http://localhost:8787" -ForegroundColor White
Write-Host "  - Frontend:    http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Gray
Write-Host ""

# Start Workers in background
$WorkerJob = Start-Job -ScriptBlock {
    param($Dir)
    Set-Location $Dir
    wrangler dev --local
} -ArgumentList $WorkerDir

# Wait a moment for Workers to start
Start-Sleep -Seconds 3

# Start Frontend in background
$FrontendJob = Start-Job -ScriptBlock {
    param($Dir)
    Set-Location $Dir
    npm run serve
} -ArgumentList $FrontendDir

# Function to cleanup jobs
function Stop-AllJobs {
    Write-Host ""
    Write-Host "Stopping services..." -ForegroundColor Yellow
    Stop-Job $WorkerJob -ErrorAction SilentlyContinue
    Remove-Job $WorkerJob -ErrorAction SilentlyContinue
    Stop-Job $FrontendJob -ErrorAction SilentlyContinue
    Remove-Job $FrontendJob -ErrorAction SilentlyContinue
    Write-Host "All services stopped." -ForegroundColor Green
}

# Register cleanup on exit
$null = Register-EngineEvent PowerShell.Exiting -Action { Stop-AllJobs }

try {
    # Monitor and output logs
    while ($true) {
        # Check if jobs are still running
        if ($WorkerJob.State -eq 'Failed' -or $FrontendJob.State -eq 'Failed') {
            Write-Host "[!] A service has stopped unexpectedly" -ForegroundColor Red
            break
        }

        # Output any new job output
        Receive-Job $WorkerJob -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "[Worker] $_" -ForegroundColor Blue
        }
        Receive-Job $FrontendJob -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "[Frontend] $_" -ForegroundColor Green
        }

        Start-Sleep -Milliseconds 500
    }
} finally {
    Stop-AllJobs
}
