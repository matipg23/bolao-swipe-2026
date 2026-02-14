import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/login?error=invalid_token', request.url)
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?error=invalid_token', request.url)
      );
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    return NextResponse.redirect(
      new URL('/login?verified=true', request.url)
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(
      new URL('/login?error=verification_failed', request.url)
    );
  }
}
