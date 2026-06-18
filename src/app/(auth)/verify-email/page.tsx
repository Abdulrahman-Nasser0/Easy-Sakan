'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { form, alert as alertStyle, card } from '@/styles/designTokens';

const VerifyEmailPage = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email verified successfully!');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-[#1a1a2e]">
            Verify Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className="bg-[#ebf7eb] border border-[#c3e6c3] text-[#008009] rounded-md p-4 text-sm">{message}</div>
            )}
            {error && (
              <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 text-sm">{error}</div>
            )}

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-600 mb-1.5">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your verification code"
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              className="uppercase tracking-wide font-semibold text-sm"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
