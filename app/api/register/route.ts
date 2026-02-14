import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { validateEmail, validatePassword } from '@/lib/validation';
import { sendVerificationEmail } from '@/lib/email';
import { generateToken } from '@/lib/utils';
import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Module-level initialization logging
console.log('[DEBUG] Register route module loaded');

async function logToFile(data: any) {
  try {
    const cursorDir = join(process.cwd(), '.cursor');
    const logPath = join(cursorDir, 'debug.log');
    const logLine = JSON.stringify(data) + '\n';
    // Ensure directory exists
    try {
      await appendFile(logPath, logLine, 'utf8');
    } catch (dirError: any) {
      if (dirError.code === 'ENOENT') {
        // Directory doesn't exist, create it
        const { mkdir } = await import('fs/promises');
        await mkdir(cursorDir, { recursive: true });
        await appendFile(logPath, logLine, 'utf8');
      } else {
        throw dirError;
      }
    }
  } catch (e) {
    // Log to console as fallback
    console.error('Debug log failed:', e);
  }
}

export async function POST(request: NextRequest) {
  console.log('[DEBUG] POST handler called');
  
  try {
    // #region agent log
    await logToFile({location:'api/register/route.ts:8',message:'POST handler entry',data:{method:request.method,url:request.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
    // #endregion
  } catch (logErr: any) {
    console.error('[DEBUG] Initial log failed:', logErr?.message);
  }

  try {
    console.log('[DEBUG] Starting request processing');
    
    // #region agent log
    await logToFile({location:'api/register/route.ts:12',message:'before body parse',data:{contentType:request.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
    // #endregion

    console.log('[DEBUG] Parsing request body');
    const body = await request.json();
    console.log('[DEBUG] Body parsed:', { hasEmail: !!body.email, hasPassword: !!body.password });
    
    // #region agent log
    await logToFile({location:'api/register/route.ts:15',message:'body parsed',data:{hasEmail:!!body.email,hasPassword:!!body.password,hasName:!!body.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
    // #endregion

    const { email, password, name } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      // #region agent log
      await logToFile({location:'api/register/route.ts:20',message:'email validation failed',data:{email,hasEmail:!!email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
      // #endregion
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password
    if (!password) {
      // #region agent log
      await logToFile({location:'api/register/route.ts:28',message:'password missing',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
      // #endregion
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // #region agent log
    await logToFile({location:'api/register/route.ts:35',message:'before password validation',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
    // #endregion

    const passwordValidation = validatePassword(password);
    
    // #region agent log
    await logToFile({location:'api/register/route.ts:38',message:'password validation result',data:{valid:passwordValidation.valid,errors:passwordValidation.errors},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
    // #endregion

    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Password validation failed', errors: passwordValidation.errors },
        { status: 400 }
      );
    }

    // #region agent log
    await logToFile({location:'api/register/route.ts:44',message:'before database check',data:{email:email.toLowerCase()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'});
    // #endregion

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // #region agent log
    await logToFile({location:'api/register/route.ts:50',message:'database check result',data:{existingUser:!!existingUser},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'});
    // #endregion

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // #region agent log
    await logToFile({location:'api/register/route.ts:58',message:'before password hash',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
    // #endregion

    // Hash password
    const passwordHash = await hashPassword(password);

    // #region agent log
    await logToFile({location:'api/register/route.ts:62',message:'password hashed',data:{hasHash:!!passwordHash},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
    // #endregion

    // Generate verification token
    const verificationToken = generateToken();

    // #region agent log
    await logToFile({location:'api/register/route.ts:68',message:'before user create',data:{email:email.toLowerCase(),hasToken:!!verificationToken},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'});
    // #endregion

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name || null,
        emailVerificationToken: verificationToken,
      },
    });

    // #region agent log
    await logToFile({location:'api/register/route.ts:78',message:'user created',data:{userId:user.id,email:user.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'});
    // #endregion

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue anyway - user can request resend later
    }

    // #region agent log
    await logToFile({location:'api/register/route.ts:87',message:'returning success',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
    // #endregion

    return NextResponse.json(
      {
        message: 'Registration successful. Please check your email to verify your account.',
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[DEBUG] Registration error caught:', {
      name: error?.constructor?.name,
      message: error?.message,
      stack: error?.stack?.substring(0, 300)
    });
    
    // #region agent log
    try {
      await logToFile({location:'api/register/route.ts:96',message:'catch error',data:{errorName:error?.constructor?.name,errorMessage:error?.message,errorStack:error?.stack?.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'});
    } catch (logErr) {
      console.error('[DEBUG] Error log failed:', logErr);
    }
    // #endregion
    
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error?.message : undefined },
      { status: 500 }
    );
  }
}
