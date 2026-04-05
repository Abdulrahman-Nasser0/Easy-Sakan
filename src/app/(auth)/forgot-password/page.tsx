'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { forgotPasswordApi } from '../../../lib/api';
import { Button } from "@/components/common/Button";

export const dynamic = 'force-dynamic';

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await forgotPasswordApi(email);

      if (response.isSuccess) {
        setMessage('If the email exists in our system, password reset instructions will be sent! Check your email inbox and spam folder.');
      } else {
        setError(response.message || 'We couldn\'t process your request at the moment. Please try again later.');
      }
    } catch {
      setError('We\'re having trouble connecting to our servers. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address to receive password reset instructions.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              fullWidth
              variant="primary"
              className="uppercase tracking-wide font-semibold text-sm bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? 'Sending...' : 'Send Instructions'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}