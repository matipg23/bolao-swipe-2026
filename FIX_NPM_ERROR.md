# How to Fix "npm is not recognized" Error

## Problem
The error occurs because Node.js is installed but not in your PowerShell session's PATH.

## Quick Fix (Current Session Only)

Run this command in your PowerShell:

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
```

Then verify it works:
```powershell
npm --version
```

## Permanent Fix

To make Node.js available in all PowerShell sessions:

### Option 1: Add to System PATH (Recommended)

1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Click "Environment Variables"
3. Under "System variables", find and select "Path", click "Edit"
4. Click "New" and add: `C:\Program Files\nodejs`
5. Click "OK" on all dialogs
6. **Restart your terminal/PowerShell**

### Option 2: Use the Fix Script

Run the provided script:
```powershell
.\fix-npm-path.ps1
```

This fixes it for the current session only.

### Option 3: Use nvm-windows (if installed)

If you're using nvm-windows, activate a Node.js version:
```powershell
nvm use <version>
# or
nvm use latest
```

## Verify Installation

After fixing, verify:
```powershell
node --version
npm --version
```

Both should show version numbers.

## Your Current Setup

✅ Node.js v24.13.0 is installed at: `C:\Program Files\nodejs`
✅ npm v11.6.2 is available
✅ Project dependencies installed
✅ Database created and seeded
✅ Development server should be running

## Next Steps

1. Open http://localhost:3000 in your browser
2. Register a new account
3. Check terminal for email verification token (in dev mode)
4. Verify email and login
5. Start making predictions!
