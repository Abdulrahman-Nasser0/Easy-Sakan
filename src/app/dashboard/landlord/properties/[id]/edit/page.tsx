import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import EditPropertyForm from './EditPropertyForm';
import { landlordStyles } from '@/styles/landlordStyles';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className={`${landlordStyles.pageContainer} flex items-center justify-center`}>
        <div className={landlordStyles.emptyState}>
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-slate-300">Authentication required. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Ensure only landlords can access
  if (session.role !== 'Landlord' && session.role !== 'Admin') {
    return (
      <div className={`${landlordStyles.pageContainer} flex items-center justify-center`}>
        <div className={landlordStyles.emptyState}>
          <div className="text-4xl mb-4">⛔</div>
          <p className="text-slate-300">Access Denied. Only Landlords can edit properties.</p>
        </div>
      </div>
    );
  }

  return <EditPropertyForm token={session.token} propertyId={parseInt(params.id)} />;
}
