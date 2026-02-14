# Fix npm PATH issue
# This script adds Node.js to the current PowerShell session's PATH

Write-Host "Checking Node.js installation..." -ForegroundColor Yellow

$nodePath = "C:\Program Files\nodejs"
$nvmPath = "C:\nvm4w\nodejs"

# Check if Node.js exists in standard location
if (Test-Path "$nodePath\node.exe") {
    Write-Host "Found Node.js at: $nodePath" -ForegroundColor Green
    
    # Add to current session PATH
    $env:PATH = "$nodePath;$env:PATH"
    
    Write-Host "`nTesting Node.js and npm..." -ForegroundColor Yellow
    $nodeVersion = & "$nodePath\node.exe" --version
    $npmVersion = & "$nodePath\npm.cmd" --version
    
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
    
    Write-Host "`n✅ Node.js and npm are now available in this session!" -ForegroundColor Green
    Write-Host "`nYou can now run: npm install" -ForegroundColor Cyan
    
    # Also check nvm path
    if (Test-Path "$nvmPath\node.exe") {
        Write-Host "`nNote: nvm-windows detected. You may want to use 'nvm use' to activate a Node.js version." -ForegroundColor Yellow
    }
} elseif (Test-Path "$nvmPath\node.exe") {
    Write-Host "Found Node.js via nvm-windows at: $nvmPath" -ForegroundColor Green
    $env:PATH = "$nvmPath;$env:PATH"
    
    $nodeVersion = & "$nvmPath\node.exe" --version
    $npmVersion = & "$nvmPath\npm.cmd" --version
    
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
    Write-Host "`n✅ Node.js and npm are now available!" -ForegroundColor Green
    Write-Host "`nNote: Consider running 'nvm use <version>' to activate a specific Node.js version." -ForegroundColor Yellow
} else {
    Write-Host "❌ Node.js not found in standard locations." -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Or if using nvm-windows, run: nvm use <version>" -ForegroundColor Yellow
}

Write-Host "`nTo make this permanent, add Node.js to your system PATH:" -ForegroundColor Cyan
Write-Host "1. Open System Properties > Environment Variables" -ForegroundColor White
Write-Host "2. Edit 'Path' variable" -ForegroundColor White
Write-Host "3. Add: C:\Program Files\nodejs" -ForegroundColor White
