import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateEmail } from '@/lib/validation';
import { sendPasswordResetEmail } from '@/lib/email';
import { generateToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with this email, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateToken();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiration

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'If an account exists with this email, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
