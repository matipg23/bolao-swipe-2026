'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/67e07f31-5f20-4cad-8505-575eeb9b160a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:19',message:'handleSubmit entry',data:{email:formData.email,hasPassword:!!formData.password,hasName:!!formData.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67e07f31-5f20-4cad-8505-575eeb9b160a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:26',message:'password mismatch',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      setErrors(['Passwords do not match']);
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
      };
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67e07f31-5f20-4cad-8505-575eeb9b160a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:35',message:'before fetch',data:{url:'/api/register',method:'POST',body:JSON.stringify(requestBody)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67e07f31-5f20-4cad-8505-575eeb9b160a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:42',message:'after fetch',data:{status:response.status,statusText:response.statusText,ok:response.ok,headers:Object.fromEntries(response.headers.entries())},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      const data = await response.json();

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67e07f31-5f20-4cad-8505-575eeb9b160a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:45',message:'response parsed',data:{hasError:!!data.error,hasErrors:!!data.errors,hasMessage:!!data.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      if (!response.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/67e07f31-5f20-4cad-8505-575eeb9b160a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:48',message:'response not ok',data:{status:response.status,error:data.error,errors:data.errors},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors([data.error || 'Registration failed']);
        }
        setLoading(false);
        return;
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67e07f31-5f20-4cad-8505-575eeb9b160a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:57',message:'success',data:{userId:data.userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      setSuccess(true);
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 3000);
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67e07f31-5f20-4cad-8505-575eeb9b160a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:61',message:'catch error',data:{errorName:error?.constructor?.name,errorMessage:error?.message,errorStack:error?.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      setErrors(['Network error. Please try again.']);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Registration Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            We've sent a verification email to <strong>{formData.email}</strong>.
            Please check your inbox and click the verification link to activate your account.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            id="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
