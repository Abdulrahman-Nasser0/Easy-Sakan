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
    if (rating === 0) { setError('Please select a rating'); return; }
    if (!bookingId) { setError('Cannot submit review: no booking reference found.'); return; }

    setLoading(true);
    setError('');
    try {
      const response = await createReview(token, { propertyId, bookingId, rating, comment: comment || undefined });
      if (response.isSuccess) {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard/student/my-bookings'), 2000);
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
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-5xl mb-4">⭐</div>
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">Thank You!</h2>
        <p className="text-gray-600 mb-6">Your review has been submitted successfully.</p>
        <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8">
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">Write a Review</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Share your experience with this property to help other students.
      </p>

      {error && (
        <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 mb-6 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-600 mb-3">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                className="text-3xl transition-colors focus:outline-none">
                <span className={star <= (hoverRating || rating) ? 'text-[#b95000]' : 'text-gray-200'}>★</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {rating === 1 && 'Poor'}{rating === 2 && 'Fair'}{rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}{rating === 5 && 'Excellent'}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Your Review (optional)</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Describe your experience staying at this property..."
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm resize-none"
            rows={5} maxLength={1000} />
          <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/1000</p>
        </div>

        <div className="bg-[#ebf3ff] border border-[#b3d4f5] rounded-md p-4 mb-6">
          <p className="text-sm text-[#0071c2]">💡 Your honest review helps other students make informed decisions. Reviews cannot be edited after submission.</p>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()}
            className="border border-gray-200 text-gray-600 hover:border-gray-300 px-6 py-2.5 rounded-md font-medium transition-colors bg-white flex-1 text-sm">
            Cancel
          </button>
          <button type="submit" disabled={loading || rating === 0}
            className="bg-[#0071c2] hover:bg-[#005999] disabled:bg-[#0071c2]/50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-md font-semibold transition-colors flex-1 text-sm">
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
