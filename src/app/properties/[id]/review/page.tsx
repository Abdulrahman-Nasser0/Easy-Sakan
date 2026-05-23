// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ReviewForm from './ReviewForm';

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session?.token) {
    redirect('/login');
  }

  const propertyId = parseInt(params.id);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ReviewForm
          token={session.token}
          propertyId={propertyId}
        />
      </div>
    </div>
  );
}
