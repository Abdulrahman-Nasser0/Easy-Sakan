import { getSession } from '@/lib/session';
import { MyBookingsClient } from './MyBookingsClient';

export default async function MyBookingsPage() {
  const session = await getSession();
  
  if (!session?.token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view your bookings.</p>
        </div>
      </div>
    );
  }

  return <MyBookingsClient token={session.token} />;
}
