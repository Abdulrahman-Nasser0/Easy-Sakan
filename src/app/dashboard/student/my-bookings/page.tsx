import { getSession } from '@/lib/session';
import { MyBookingsClient } from './MyBookingsClient';
import { studentStyles } from '@/styles/studentStyles';

export default async function MyBookingsPage() {
  const session = await getSession();
  
  if (!session?.token) {
    return (
      <div className={`${studentStyles.pageContainer} flex items-center justify-center`}>
        <div className={studentStyles.emptyState}>
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-white mb-3">Authentication Required</h2>
          <p className="text-slate-300">Please log in to view your bookings.</p>
        </div>
      </div>
    );
  }

  return <MyBookingsClient token={session.token} />;
}
