import { getSession } from '@/lib/session';
import { MyBookingsClient } from './MyBookingsClient';

export default async function MyBookingsPage() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-12 px-6 bg-white rounded-lg border border-gray-200">
          <div className="text-4xl mb-4 opacity-40">🔐</div>
          <h2 className="text-lg font-medium text-[#1a1a2e] mb-2">Authentication Required</h2>
          <p className="text-gray-500">Please log in to view your bookings.</p>
        </div>
      </div>
    );
  }

  return <MyBookingsClient token={session.token} />;
}
