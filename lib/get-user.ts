import { headers } from 'next/headers';
import { verifyToken } from './auth';
import { cookies } from 'next/headers';

export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded?.userId || null;
}

export async function getUserIdFromHeader(): Promise<string | null> {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  return userId;
}
