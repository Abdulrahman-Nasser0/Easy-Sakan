'use client';

import { useState } from 'react';
import { resendVerificationApi } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Session {
  userId: string;
  name: string;
  email: string;
  role: 'Student' | 'Landlord' | 'Admin';
  isVerified: boolean;
  profileImage?: string | null;
}

interface ProfileContentProps {
  session: Session;
}

export default function ProfileContent({ session }: ProfileContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerifyEmail = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await resendVerificationApi(session.email, 0);
      console.log('Send verification code response:', response); // Debug log

      if (response.isSuccess) {
        setMessage('Verification code sent! Redirecting to verification page...');
        // Redirect to verify-email page
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(session.email)}`);
        }, 1500);
      } else {
        setError(response.message || 'Failed to send verification code.');
      }
    } catch (error) {
      console.error('Send verification code error:', error); // Debug log
      setError('We\'re having trouble connecting to our servers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Email Verification Banner */}
        {!session.isVerified && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Email Verification Required</h3>
              <p className="text-sm text-yellow-700 mt-1">Please verify your email address to unlock all features</p>
            </div>
            <div className="ml-4 flex gap-3 shrink-0">
              <button
                onClick={handleVerifyEmail}
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Sending...' : 'Send Code & Verify'}
              </button>
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-sm text-green-700">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <p className="mt-1 text-sm text-gray-900">{session.userId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{session.name || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{session.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    session.role === 'Landlord' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {session.role}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                <p className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    session.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.isVerified ? '✓ Verified' : 'Pending Verification'}
                  </span>
                </p>
              </div>

              {session.profileImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                  <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={session.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Account Status</h2>
          </div>

          <div className="px-6 py-6 space-y-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                session.isVerified ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-gray-900">
                {session.isVerified ? '✓ Account Verified' : '⚠ Account Pending Verification'}
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3 bg-green-500"></div>
              <span className="text-sm text-gray-900">✓ Logged In</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
