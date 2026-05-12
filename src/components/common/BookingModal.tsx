'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking } from '@/lib/api';
import { getSession } from '@/lib/session';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  propertyTitle: string;
  monthlyPrice: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  monthlyPrice,
}: BookingModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState<string>('');
  
  const [form, setForm] = useState({
    checkInDate: '',
    checkOutDate: '',
  });

  useEffect(() => {
    // Get session token on mount
    const getToken = async () => {
      const session = await getSession();
      if (session?.token) {
        setToken(session.token);
      }
    };
    getToken();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const calculateMonths = () => {
    if (!form.checkInDate || !form.checkOutDate) return 0;
    
    const checkIn = new Date(form.checkInDate);
    const checkOut = new Date(form.checkOutDate);
    const months = (checkOut.getFullYear() - checkIn.getFullYear()) * 12 +
      (checkOut.getMonth() - checkIn.getMonth());
    
    return Math.max(0, months);
  };

  const totalPrice = calculateMonths() * monthlyPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate dates
      if (!form.checkInDate || !form.checkOutDate) {
        setError('Please select both check-in and check-out dates');
        setLoading(false);
        return;
      }

      const checkIn = new Date(form.checkInDate);
      const checkOut = new Date(form.checkOutDate);

      if (checkOut <= checkIn) {
        setError('Check-out date must be after check-in date');
        setLoading(false);
        return;
      }

      if (checkIn < new Date()) {
        setError('Check-in date cannot be in the past');
        setLoading(false);
        return;
      }

      if (!token) {
        setError('Please login to create a booking');
        setLoading(false);
        return;
      }

      const response = await createBooking(token, {
        propertyId,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
      });

      if (response.isSuccess) {
        setSuccess('Booking created successfully!');
        setForm({ checkInDate: '', checkOutDate: '' });
        
        // Redirect to my bookings after 1.5s
        setTimeout(() => {
          onClose();
          router.push('/dashboard/student/my-bookings');
        }, 1500);
      } else {
        setError(response.message || 'Failed to create booking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Book Property</h2>
              <p className="text-sm text-gray-600 mt-1">{propertyTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 font-bold text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Check-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Date
            </label>
            <input
              type="date"
              name="checkInDate"
              value={form.checkInDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              required
            />
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Date
            </label>
            <input
              type="date"
              name="checkOutDate"
              value={form.checkOutDate}
              onChange={handleChange}
              min={form.checkInDate || new Date().toISOString().split('T')[0]}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              required
            />
          </div>

          {/* Price Summary */}
          {form.checkInDate && form.checkOutDate && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monthly Price:</span>
                <span className="font-medium">{monthlyPrice.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Months:</span>
                <span className="font-medium">{calculateMonths()}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between">
                <span className="text-gray-900 font-bold">Total Price:</span>
                <span className="font-bold text-blue-600 text-lg">
                  {totalPrice.toLocaleString()} EGP
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.checkInDate || !form.checkOutDate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
