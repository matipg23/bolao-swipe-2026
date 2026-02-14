# Setup script for World Cup 2026 Predictor App
# Run this script to set up the project for local development

Write-Host "Setting up World Cup 2026 Predictor App..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm is not installed" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "`nCreating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please edit .env file with your configuration" -ForegroundColor Yellow
} else {
    Write-Host "`.env file already exists" -ForegroundColor Green
}

# Generate Prisma client
Write-Host "`nGenerating Prisma client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

# Push database schema
Write-Host "`nSetting up database..." -ForegroundColor Yellow
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to set up database" -ForegroundColor Red
    exit 1
}

# Seed database
Write-Host "`nSeeding database with teams and matches..." -ForegroundColor Yellow
npm run db:seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to seed database" -ForegroundColor Red
    exit 1
}

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "`nTo start the development server, run: npm run dev" -ForegroundColor Cyan
Write-Host "The app will be available at http://localhost:3000" -ForegroundColor Cyan
