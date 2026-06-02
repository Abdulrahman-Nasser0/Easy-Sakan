'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking } from '@/lib/api';
import { studentStyles } from '@/styles/studentStyles';
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
    <div className={studentStyles.modalBackdrop}>
      <div className={studentStyles.modal}>
        <div className={studentStyles.modalHeader}>
          <h2 className="text-xl font-bold text-white">📅 Book {propertyTitle}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={studentStyles.modalBody}>
          {error && <div className={studentStyles.alertError + " mb-4"}>{error}</div>}
          
          <div className="mb-6">
            <label className={studentStyles.inputLabel}>Move-in Date</label>
            <input 
              type="date" 
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className={studentStyles.input}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <p className="text-xs text-slate-500 mt-1">You will have 48 hours to complete payment after booking.</p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg mb-6 border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">Monthly Price:</span>
              <span className="text-sky-400 font-bold">{monthlyPrice.toLocaleString()} EGP</span>
            </div>
            <p className="text-xs text-slate-500">
              A deposit of {monthlyPrice.toLocaleString()} EGP is required to confirm your booking.
            </p>
          </div>

          <div className={studentStyles.modalFooter}>
             <button type="button" onClick={onClose} className={studentStyles.btnSecondary}>Cancel</button>
             <button type="submit" disabled={loading} className={studentStyles.btnPrimary}>
               {loading ? 'Booking...' : 'Confirm Request'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
