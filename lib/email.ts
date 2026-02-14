import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Create transporter (for development, use Gmail SMTP or Mailtrap)
// For production, consider using Resend or SendGrid
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER && SMTP_PASS ? {
    user: SMTP_USER,
    pass: SMTP_PASS,
  } : undefined,
});

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: SMTP_FROM,
    to: email,
    subject: 'Verify your email - World Cup 2026 Predictor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Welcome to World Cup 2026 Predictor!</h1>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <p style="margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #0066cc; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
    text: `Welcome to World Cup 2026 Predictor! Please verify your email by visiting: ${verificationUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    // In development, we might want to log the token instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Verification token for ${email}: ${token}`);
      console.log(`[DEV] Verification URL: ${verificationUrl}`);
    }
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: SMTP_FROM,
    to: email,
    subject: 'Reset your password - World Cup 2026 Predictor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to create a new password:</p>
        <p style="margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #0066cc; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        </p>
      </div>
    `,
    text: `Reset your password by visiting: ${resetUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    // In development, log the token
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Reset token for ${email}: ${token}`);
      console.log(`[DEV] Reset URL: ${resetUrl}`);
    }
    throw error;
  }
}
