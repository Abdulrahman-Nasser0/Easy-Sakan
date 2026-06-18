'use client';

import { useState } from 'react';
import Link from 'next/link';
import { changePasswordApi } from '@/lib/api';
import { form, alert, card, badge } from '@/styles/designTokens';

interface SettingsFormProps {
  token: string;
  role: 'Student' | 'Landlord' | 'Admin';
  userEmail: string;
  userName: string;
}

export default function SettingsForm({ token, role, userEmail, userName }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState<'password' | 'notifications'>('password');
  
  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Notification Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');
  const [notificationsSuccess, setNotificationsSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await changePasswordApi(currentPassword, newPassword, token);
      if (response.isSuccess) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(response.message || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotificationsError('');
    setNotificationsSuccess('');

    setNotificationsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotificationsSuccess('Notification preferences saved!');
    } catch (err) {
      setNotificationsError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setNotificationsLoading(false);
    }
  };

  const tabClass = (tab: string) =>
    `px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
      activeTab === tab
        ? 'border-[#0071c2] text-[#0071c2]'
        : 'border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300'
    }`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1a1a2e]">⚙️ Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences</p>
          </div>
          <Link
            href={role === 'Landlord' ? '/dashboard/landlord' : '/dashboard/student'}
            className="text-[#0071c2] hover:text-[#005999] font-medium transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Profile Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#0071c2] rounded-full flex items-center justify-center text-white text-xl font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[#1a1a2e] font-semibold text-lg">{userName}</p>
              <p className="text-gray-600 text-sm">{userEmail}</p>
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#ebf3ff] text-[#0071c2]">{role}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6">
            <button onClick={() => setActiveTab('password')} className={tabClass('password')}>
              🔒 Change Password
            </button>
            <button onClick={() => setActiveTab('notifications')} className={tabClass('notifications')}>
              🔔 Notifications
            </button>
          </div>
        </div>

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 -mx-6 -mt-6 mb-0">
              <h2 className="text-xl font-semibold text-[#1a1a2e]">Change Password</h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-5 mt-6 px-6 pb-6">
              {passwordError && <div className="p-4 bg-[#ffebee] border border-[#cc0000] text-[#cc0000] rounded-lg text-sm">{passwordError}</div>}
              {passwordSuccess && <div className="p-4 bg-[#ebf7eb] border border-[#008009] text-[#008009] rounded-lg text-sm">{passwordSuccess}</div>}

              <div>
                <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={passwordLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a2e] mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={passwordLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={passwordLoading}
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="px-6 py-2.5 bg-[#0071c2] hover:bg-[#005999] disabled:bg-[#0071c2]/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {passwordLoading ? '⏳ Updating...' : '✓ Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 -mx-6 -mt-6 mb-0">
              <h2 className="text-xl font-semibold text-[#1a1a2e]">Notification Preferences</h2>
            </div>

            <form onSubmit={handleSaveNotifications} className="space-y-5 mt-6 px-6 pb-6">
              {notificationsError && <div className="p-4 bg-[#ffebee] border border-[#cc0000] text-[#cc0000] rounded-lg text-sm">{notificationsError}</div>}
              {notificationsSuccess && <div className="p-4 bg-[#ebf7eb] border border-[#008009] text-[#008009] rounded-lg text-sm">{notificationsSuccess}</div>}

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-[#0071c2] hover:bg-[#ebf3ff] transition-colors">
                  <div>
                    <p className="text-[#1a1a2e] font-medium">Email Notifications</p>
                    <p className="text-gray-600 text-sm mt-0.5">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#0071c2] focus:ring-[#0071c2]/20 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-[#0071c2] hover:bg-[#ebf3ff] transition-colors">
                  <div>
                    <p className="text-[#1a1a2e] font-medium">Booking Updates</p>
                    <p className="text-gray-600 text-sm mt-0.5">Get notified about booking status changes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={bookingUpdates}
                    onChange={(e) => setBookingUpdates(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#0071c2] focus:ring-[#0071c2]/20 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-[#0071c2] hover:bg-[#ebf3ff] transition-colors">
                  <div>
                    <p className="text-[#1a1a2e] font-medium">Promotional Emails</p>
                    <p className="text-gray-600 text-sm mt-0.5">Receive offers and promotions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={promotionalEmails}
                    onChange={(e) => setPromotionalEmails(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#0071c2] focus:ring-[#0071c2]/20 cursor-pointer"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={notificationsLoading}
                className="px-6 py-2.5 bg-[#0071c2] hover:bg-[#005999] disabled:bg-[#0071c2]/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {notificationsLoading ? '⏳ Saving...' : '💾 Save Preferences'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
