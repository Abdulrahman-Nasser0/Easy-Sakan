'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import Link from 'next/link';
import { form, alert as alertStyle, card } from '@/styles/designTokens';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('If an account with that email exists, a password reset link has been sent.');
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className={card.base}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className={alertStyle.success}>{message}</div>
            )}
            {error && (
              <div className={alertStyle.error}>{error}</div>
            )}

            <div>
              <label htmlFor="email" className={form.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={form.input}
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              className="uppercase tracking-wide font-semibold text-sm"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center pt-4 border-t border-slate-700">
              <Link href="/login" className="text-sm text-sky-400 hover:text-sky-300 font-medium">
                ← Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
