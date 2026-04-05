'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, redirect } from 'next/navigation';
import Link from 'next/link';
import { confirmEmailApi, resendVerificationApi } from '../../../lib/api';
import { Button } from "@/components/common/Button";

// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  // Automatically send verification code when user arrives on this page
  useEffect(() => {
    const sendInitialCode = async () => {
      if (email && !codeSent) {
        try {
          console.log('Automatically sending verification code to:', email);
          const response = await resendVerificationApi(email, 0);
          console.log('Initial verification code response:', response);

          if (response.isSuccess) {
            setMessage('✓ Verification code sent to your email! Check your inbox and spam folder.');
            setCodeSent(true);
          } else {
            setError(response.message || 'Could not send verification code. Please click "Resend" to try again.');
          }
        } catch (err) {
          console.error('Error sending initial code:', err);
          setError('Connection error. Please click "Resend" to try again.');
        }
      }
    };

    sendInitialCode();
  }, [email, codeSent]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await confirmEmailApi(email, code);

      if (response.isSuccess) {
        setMessage('Email verified successfully! Redirecting to login...');
        redirect('/login');
      } else {
        setError(response.message || 'The verification code is invalid or has expired. Please request a new code.');
      }
    } catch {
      setError('We\'re having trouble connecting to our servers. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setMessage('');

    try {
      const response = await resendVerificationApi(email, 0); // 0 for email verification
      console.log('Resend verification response:', response); // Debug log

      if (response.isSuccess) {
        setMessage('✓ New verification code sent! Check your email inbox and spam folder.');
        setCodeSent(true);
      } else {
        setError(response.message || 'We couldn\'t send a new code at the moment. Please try again in a few minutes.');
      }
    } catch (error) {
      console.error('Resend verification error:', error); // Debug log
      setError('We\'re having trouble connecting to our servers. Please check your internet connection and try again.');
    } finally {
      setResending(false);
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
          <h2 className="text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We sent a verification code to <span className="font-semibold">{email}</span>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest"
                maxLength={6}
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
              disabled={code.length !== 6}
              variant="primary"
              className="uppercase tracking-wide font-semibold text-sm bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <Button
              type="button"
              onClick={handleResend}
              loading={resending}
              variant="ghost"
              className="text-sm text-purple-600 hover:text-purple-500 font-medium"
            >
              {resending ? 'Sending...' : "Didn't receive the code? Resend"}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}