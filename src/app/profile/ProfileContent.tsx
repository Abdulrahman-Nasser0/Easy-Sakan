'use client';

import { useState } from 'react';
import Link from "next/link";
import { updateProfile } from '@/lib/api';
import { refreshSessionAfterProfileUpdate } from './actions';

interface Session {
  userId: number;
  name: string;
  email: string;
  role: 'Student' | 'Landlord' | 'Admin';
  isVerified: boolean;
  profileImage?: string | null;
  token: string;
}

interface ProfileContentProps {
  session: Session;
  university?: string;
}

export default function ProfileContent({ session, university }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session.name || '');
  const [email, setEmail] = useState(session.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const inputClass =
    'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors';

  const readOnlyClass =
    'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[#1a1a2e] cursor-not-allowed';

  async function handleSave() {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateProfile(session.token, { name, email });

    setIsLoading(false);

    if (result.isSuccess) {
      await refreshSessionAfterProfileUpdate(name, email);
      setSuccess(true);
      setIsEditing(false);
    } else {
      setError(result.message || 'Failed to update profile.');
    }
  }

  function handleCancel() {
    setName(session.name || '');
    setEmail(session.email || '');
    setError(null);
    setIsEditing(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1a1a2e]">👤 My Profile</h1>
            <p className="text-gray-600 mt-1">Your account details and status</p>
          </div>
          <Link
            href={session.role === 'Landlord' ? '/dashboard/landlord' : '/dashboard/student'}
            className="text-[#0071c2] hover:text-[#005999] font-medium transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Email Verification Banner */}
        {!session.isVerified && (
          <div className="mb-8 bg-[#fff3e0] border border-[#b95000]/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-[#b95000] text-lg">⚠️</span>
              <div>
                <h3 className="text-sm font-semibold text-[#b95000]">Email Verification Pending</h3>
                <p className="text-sm text-[#b95000]/80 mt-1">Your account is pending email verification. An admin will review and approve your account.</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="mb-8 bg-[#ebf7eb] border border-[#008009]/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-[#008009] text-lg">✓</span>
              <p className="text-sm font-semibold text-[#008009]">Profile updated successfully.</p>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg mb-8 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1a1a2e]">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => { setSuccess(false); setIsEditing(true); }}
                className="text-sm text-[#0071c2] hover:text-[#005999] font-medium transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          <div className="px-6 py-6">
            {error && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1a1a2e] mb-2">User ID</label>
                <input
                  type="text"
                  value={session.userId}
                  readOnly
                  className={readOnlyClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Full Name</label>
                <input
                  type="text"
                  value={name || 'Not set'}
                  readOnly={!isEditing}
                  onChange={e => setName(e.target.value)}
                  className={isEditing ? inputClass : readOnlyClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly={!isEditing}
                  onChange={e => setEmail(e.target.value)}
                  className={isEditing ? inputClass : readOnlyClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Role</label>
                <input
                  type="text"
                  value={session.role}
                  readOnly
                  className={readOnlyClass}
                />
              </div>

              {session.role === 'Student' && (
                <div>
                  <label className="block text-sm font-medium text-[#1a1a2e] mb-2">University</label>
                  <input
                    type="text"
                    value={university || 'Not set'}
                    readOnly
                    className={readOnlyClass}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Verification Status</label>
                <p className="mt-1">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    session.isVerified
                      ? 'bg-[#ebf7eb] border border-[#008009] text-[#008009]'
                      : 'bg-[#fff3e0] border border-[#b95000] text-[#b95000]'
                  }`}>
                    {session.isVerified ? '✓ Verified' : 'Pending Verification'}
                  </span>
                </p>
              </div>

              {session.profileImage && (
                <div>
                  <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Profile Image</label>
                  <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden bg-gray-200 border border-gray-200">
                    <img
                      src={session.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-5 py-2 bg-[#0071c2] text-white text-sm font-medium rounded-lg hover:bg-[#005999] disabled:opacity-60 transition-colors"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-5 py-2 bg-white border border-gray-200 text-[#1a1a2e] text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#1a1a2e]">Account Status</h2>
          </div>

          <div className="px-6 py-6 space-y-4">
            <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                session.isVerified ? 'bg-[#008009]' : 'bg-[#b95000]'
              }`}></div>
              <span className="text-sm text-[#1a1a2e]">
                {session.isVerified ? '✓ Account Verified' : '⚠ Account Pending Verification'}
              </span>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-3 h-3 rounded-full mr-3 bg-[#008009]"></div>
              <span className="text-sm text-[#1a1a2e]">✓ Logged In</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
