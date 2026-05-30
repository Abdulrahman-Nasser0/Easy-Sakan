'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { getUnreadNotificationCount, getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/api';

interface NotificationBellProps {
  token: string;
  userRole: string | undefined;
}

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    link?: string;
    bookingId?: number;
    propertyId?: number;
  };
}

export default function NotificationBell({ token, userRole }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadNotificationCount(token);
      if (response.isSuccess && response.data) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getNotifications(token, 1, 5);
      if (response.isSuccess && response.data?.items) {
        setNotifications(response.data.items);
        if (response.data.unreadCount !== undefined) {
          setUnreadCount(response.data.unreadCount);
        }
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (showDropdown) {
      fetchNotifications();
    }
  }, [showDropdown, fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(token, notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      BOOKING_REQUEST: '📅',
      BOOKING_CONFIRMED: '✅',
      BOOKING_CANCELLED: '❌',
      PAYMENT_RECEIVED: '💰',
      NEW_REVIEW: '⭐',
      PROPERTY_APPROVED: '🏠',
      PROPERTY_REJECTED: '🚫',
      REPORT_RESOLVED: '🔧',
      SYSTEM: '🔔',
    };
    return icons[type] || '🔔';
  };

  const getNotificationLink = (notification: NotificationItem) => {
    if (notification.metadata?.link) return notification.metadata.link;
    if (notification.metadata?.bookingId) return '/dashboard/student/my-bookings';
    if (notification.metadata?.propertyId && userRole === 'Landlord') return '/dashboard/landlord/my-listings';
    return '/profile';
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all duration-200"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-3 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border border-slate-600 border-t-blue-400"></div>
                <p className="text-xs text-slate-400 mt-2">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-slate-400 text-sm">No notifications yet</p>
                <p className="text-xs text-slate-500 mt-1">We&apos;ll notify you when something arrives</p>
              </div>
            ) : (
              notifications.map(n => (
                <Link
                  key={n.id}
                  href={getNotificationLink(n)}
                  onClick={() => {
                    if (!n.isRead) handleMarkAsRead(n.id);
                    setShowDropdown(false);
                  }}
                  className={`block px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${
                    !n.isRead ? 'bg-blue-600/10' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-lg shrink-0 mt-0.5">{getNotificationIcon(n.type)}</span>
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${!n.isRead ? 'text-white font-semibold' : 'text-slate-300'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{n.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{formatTime(n.createdAt)}</p>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2"></div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <Link
            href="/profile?tab=notifications"
            onClick={() => setShowDropdown(false)}
            className="block px-4 py-3 text-center text-sm text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 transition-colors border-t border-slate-700"
          >
            View all notifications →
          </Link>
        </div>
      )}
    </div>
  );
}
