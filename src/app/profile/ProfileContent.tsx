'use client';

import { useState } from 'react';
import Link from "next/link";

interface Session {
  userId: number;
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
  const inputClass =
    'w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors';

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">👤 My Profile</h1>
            <p className="text-slate-400 mt-1">Your account details and status</p>
          </div>
          <Link
            href={session.role === 'Landlord' ? '/dashboard/landlord' : '/dashboard/student'}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Email Verification Banner */}
        {!session.isVerified && (
          <div className="mb-8 bg-amber-900/30 border border-amber-600/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-amber-400 text-lg">⚠️</span>
              <div>
                <h3 className="text-sm font-semibold text-amber-200">Email Verification Pending</h3>
                <p className="text-sm text-amber-300/80 mt-1">Your account is pending email verification. An admin will review and approve your account.</p>
              </div>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Personal Information</h2>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">User ID</label>
                <input
                  type="text"
                  value={session.userId}
                  readOnly
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={session.name || 'Not set'}
                  readOnly
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="text"
                  value={session.email}
                  readOnly
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <input
                  type="text"
                  value={session.role}
                  readOnly
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Verification Status</label>
                <p className="mt-1">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    session.isVerified 
                      ? 'bg-green-900/50 border border-green-600 text-green-200' 
                      : 'bg-amber-900/50 border border-amber-600 text-amber-200'
                  }`}>
                    {session.isVerified ? '✓ Verified' : 'Pending Verification'}
                  </span>
                </p>
              </div>

              {session.profileImage && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Profile Image</label>
                  <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden bg-slate-700 border border-slate-600">
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

        {/* Account Status */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Account Status</h2>
          </div>

          <div className="px-6 py-6 space-y-4">
            <div className="flex items-center p-4 bg-slate-900/30 border border-slate-700 rounded-lg">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                session.isVerified ? 'bg-green-500' : 'bg-amber-500'
              }`}></div>
              <span className="text-sm text-slate-200">
                {session.isVerified ? '✓ Account Verified' : '⚠ Account Pending Verification'}
              </span>
            </div>
            
            <div className="flex items-center p-4 bg-slate-900/30 border border-slate-700 rounded-lg">
              <div className="w-3 h-3 rounded-full mr-3 bg-green-500"></div>
              <span className="text-sm text-slate-200">✓ Logged In</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
