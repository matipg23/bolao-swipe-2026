import { z } from 'zod';

export function validateEmail(email: string): boolean {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function checkDeadline(): Promise<boolean> {
  // This will be implemented to check against app_settings
  // For now, return true (editing allowed)
  return true;
}

export function isAfterDeadline(deadline: string): boolean {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return now >= deadlineDate;
}
