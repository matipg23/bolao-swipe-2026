# Setup Instructions for World Cup 2026 Predictor App

## Prerequisites

1. **Node.js 18+** - Download and install from [https://nodejs.org/](https://nodejs.org/)
   - This will also install npm (Node Package Manager)
   - Verify installation by running: `node --version` and `npm --version`

## Quick Setup (Windows PowerShell)

1. Open PowerShell in the project directory
2. Run the setup script:
   ```powershell
   .\setup.ps1
   ```

## Manual Setup

If the setup script doesn't work, follow these steps:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - Keep default: `file:./dev.db`
- `JWT_SECRET` - Generate a random string (e.g., use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- Email settings (optional for development - you can skip SMTP config for now)

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed database with teams and matches
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Troubleshooting

### Node.js/npm not found

- Make sure Node.js is installed and added to your system PATH
- Restart your terminal after installing Node.js
- Try using the full path to node/npm if they're installed but not in PATH

### Database errors

- Delete `prisma/dev.db` and `prisma/dev.db-journal` if they exist
- Run `npx prisma db push` again
- Run `npm run db:seed` again

### Port 3000 already in use

- Change the port in `package.json` scripts: `"dev": "next dev -p 3001"`
- Or stop the process using port 3000

### Email verification not working

- For development, check the console logs - tokens are logged in development mode
- Or configure SMTP settings in `.env` (Gmail SMTP or Mailtrap for testing)

## Next Steps

1. Open http://localhost:3000 in your browser
2. Register a new account
3. Check your email (or console logs in dev mode) for verification link
4. Login and start making predictions!

## Useful Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Re-seed database
- `npx prisma db push` - Update database schema
