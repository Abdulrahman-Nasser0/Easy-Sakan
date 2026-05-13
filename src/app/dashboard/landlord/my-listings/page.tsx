// Server Component - Gets session and passes token to client component
import { getSession } from '@/lib/session';
import MyListingsForm from './MyListingsForm';
import { landlordStyles } from '@/styles/landlordStyles';

export const dynamic = 'force-dynamic';

export default async function MyListingsPage() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className={`${landlordStyles.pageContainer} flex items-center justify-center`}>
        <div className={landlordStyles.emptyState}>
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-slate-300">Unable to load. Please log in again.</p>
        </div>
      </div>
    );
  }

  if (session.role !== 'Landlord' && session.role !== 'Admin') {
    return (
      <div className={`${landlordStyles.pageContainer} flex items-center justify-center`}>
        <div className={landlordStyles.emptyState}>
          <div className="text-4xl mb-4">⛔</div>
          <p className="text-slate-300">Access Denied. Only Landlords can view this page.</p>
        </div>
      </div>
    );
  }

  return <MyListingsForm token={session.token} />;
}
