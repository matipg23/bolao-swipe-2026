@echo off
echo Starting World Cup 2026 Predictor App...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo Creating .env file...
    (
        echo DATABASE_URL="file:./dev.db"
        echo JWT_SECRET="dev-secret-key-change-in-production-12345"
        echo NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ) > .env
    echo .env file created. You can edit it if needed.
    echo.
)

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if Prisma client is generated
if not exist node_modules\.prisma (
    echo Generating Prisma client...
    call npx prisma generate
)

REM Check if database exists
if not exist prisma\dev.db (
    echo Setting up database...
    call npx prisma db push
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to set up database
        pause
        exit /b 1
    )
    
    echo Seeding database...
    call npm run db:seed
)

echo.
echo Starting development server...
echo Open http://localhost:3000 in your browser
echo.
call npm run dev
