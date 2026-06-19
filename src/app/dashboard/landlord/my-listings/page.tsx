import { getSession } from '@/lib/session';
import MyListingsForm from './MyListingsForm';

export const dynamic = 'force-dynamic';

export default async function MyListingsPage() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center max-w-md">
          <div className="text-4xl mb-4 opacity-40">🔐</div>
          <p className="text-gray-500">Unable to load. Please log in again.</p>
        </div>
      </div>
    );
  }

  if (session.role !== 'Landlord' && session.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center max-w-md">
          <div className="text-4xl mb-4 opacity-40">⛔</div>
          <p className="text-gray-500">Access Denied. Only Landlords can view this page.</p>
        </div>
      </div>
    );
  }

  return <MyListingsForm token={session.token} />;
}
