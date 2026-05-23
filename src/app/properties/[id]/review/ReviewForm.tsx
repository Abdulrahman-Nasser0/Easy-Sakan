'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createReview } from '@/lib/api';

interface ReviewFormProps {
  token: string;
  propertyId: number;
  bookingId?: number;
}

export default function ReviewForm({ token, propertyId, bookingId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await createReview(token, {
        propertyId,
        bookingId: bookingId || 0,
        rating,
        comment: comment || undefined,
      });

      if (response.isSuccess) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/student/my-bookings');
        }, 2000);
      } else {
        setError(response.message || 'Failed to submit review');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
        <div className="text-5xl mb-4">⭐</div>
        <h2 className="text-2xl font-bold text-white mb-3">Thank You!</h2>
        <p className="text-slate-300 mb-6">Your review has been submitted successfully.</p>
        <p className="text-sm text-slate-400">Redirecting to your bookings...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
      <h1 className="text-2xl font-bold text-white mb-2">⭐ Write a Review</h1>
      <p className="text-slate-400 mb-6">
        Share your experience with this property to help other students.
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Rating Stars */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Your Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-3xl transition-colors focus:outline-none"
              >
                <span
                  className={
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 drop-shadow-lg drop-shadow-yellow-400/50'
                      : 'text-slate-600'
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-400 mt-2">
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </p>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Your Review (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe your experience staying at this property..."
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            rows={5}
            maxLength={1000}
          />
          <p className="text-xs text-slate-500 mt-1 text-right">
            {comment.length}/1000
          </p>
        </div>

        {/* Submitting info */}
        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-300">
            💡 Your honest review helps other students make informed decisions. Reviews cannot be edited after submission.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Submitting...' : '⭐ Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
