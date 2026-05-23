// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ReviewForm from './ReviewForm';

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { bookingId?: string };
}) {
  const session = await getSession();

  if (!session?.token) {
    redirect('/login');
  }

  const propertyId = parseInt(params.id);
  const bookingId = searchParams.bookingId ? parseInt(searchParams.bookingId) : undefined;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ReviewForm
          token={session.token}
          propertyId={propertyId}
          bookingId={bookingId}
        />
      </div>
    </div>
  );
}
