# Quick Start Guide

## Step 1: Install Node.js (if not already installed)

1. Download Node.js from: https://nodejs.org/
2. Install it (this will also install npm)
3. **Restart your terminal/PowerShell** after installation
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

## Step 2: Navigate to Project Directory

```powershell
cd "C:\Projects\Bolao 2026 - Predictor App"
```

## Step 3: Install Dependencies

```powershell
npm install
```

This will install all required packages (Next.js, Prisma, etc.)

## Step 4: Create Environment File

Create a file named `.env` in the project root with this content:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-key-change-in-production-12345"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

(Email settings are optional for development - tokens will be logged to console)

## Step 5: Set Up Database

```powershell
# Generate Prisma client
npx prisma generate

# Create database
npx prisma db push

# Seed with teams and matches
npm run db:seed
```

## Step 6: Start Development Server

```powershell
npm run dev
```

## Step 7: Open in Browser

Open: **http://localhost:3000**

## First Steps

1. **Register** a new account at `/register`
2. **Check console logs** for email verification token (in development mode)
3. **Verify email** by visiting the link shown in console, or go to `/verify-email?token=YOUR_TOKEN`
4. **Login** at `/login`
5. **Make predictions** at `/predictions`

## Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Restart terminal after installing Node.js
- Reinstall Node.js and check "Add to PATH" option

### Port 3000 in use
- Change port: Edit `package.json`, change `"dev": "next dev"` to `"dev": "next dev -p 3001"`

### Database errors
- Delete `prisma/dev.db` if it exists
- Run `npx prisma db push` again
- Run `npm run db:seed` again

### Email verification
- In development, check the console/terminal for verification tokens
- Or manually visit: `/verify-email?token=TOKEN_FROM_CONSOLE`

## Useful Commands

- `npm run dev` - Start server
- `npm run db:studio` - View database in browser
- `npm run build` - Build for production
