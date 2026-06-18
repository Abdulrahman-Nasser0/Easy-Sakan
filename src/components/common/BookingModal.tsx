'use client';

import React, { useState } from 'react';
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

export default function BookingModal({ isOpen, onClose, propertyId, propertyTitle, monthlyPrice }: BookingModalProps) {
  const router = useRouter();
  const [moveInDate, setMoveInDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!moveInDate) {
      setError('Please select a move-in date.');
      setLoading(false);
      return;
    }

    try {
      const sessionRes = await fetch('/api/auth/session');
      if (!sessionRes.ok) {
        setError('You must be logged in to book a property.');
        setLoading(false);
        return;
      }
      
      const session = await sessionRes.json();
      if (!session || !session.token) {
        setError('You must be logged in to book a property.');
        setLoading(false);
        return;
      }

      const response = await createBooking(session.token, {
        propertyId,
        moveInDate,
      });

      if (response.isSuccess) {
        onClose();
        router.push('/dashboard/student/my-bookings');
      } else {
        setError(response.message || 'Failed to create booking.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-lg max-w-lg w-full shadow-xl">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#1a1a2e]">📅 Book {propertyTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {error && <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Move-in Date</label>
            <input 
              type="date" 
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <p className="text-xs text-gray-500 mt-1">You will have 48 hours to complete payment after booking.</p>
          </div>

          <div className="bg-[#f2f6fc] p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Monthly Price:</span>
              <span className="text-[#0071c2] font-bold">{monthlyPrice.toLocaleString()} EGP</span>
            </div>
            <p className="text-xs text-gray-500">
              A deposit of {monthlyPrice.toLocaleString()} EGP is required to confirm your booking.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
             <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">Cancel</button>
             <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[#0071c2] hover:bg-[#005999] text-white rounded-md transition-colors">
               {loading ? 'Booking...' : 'Confirm Request'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
