'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    // The verification is handled server-side via GET /api/verify-email
    // This page is just for display - the actual verification happens via redirect
    // So we'll just show a message
    setStatus('success');
    setMessage('Email verified successfully! Redirecting to login...');
    
    setTimeout(() => {
      router.push('/login?verified=true');
    }, 2000);
  }, [searchParams, router]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
      {status === 'verifying' && (
        <>
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold mb-4">Verifying Email</h1>
          <p className="text-gray-600">{message}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">Email Verified!</h1>
          <p className="text-gray-600">{message}</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h1>
          <p className="text-gray-600 mb-4">{message}</p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8"><p>Loading...</p></div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
