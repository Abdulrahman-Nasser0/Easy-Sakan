// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ReviewForm from './ReviewForm';

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const session = await getSession();

  if (!session?.token) {
    redirect('/login');
  }

  const { id } = await params;
  const { bookingId: bookingIdStr } = await searchParams;
  const propertyId = parseInt(id);
  const bookingId = bookingIdStr ? parseInt(bookingIdStr) : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
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
