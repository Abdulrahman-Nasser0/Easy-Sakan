import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import EditPropertyForm from './EditPropertyForm';
import { landlordStyles } from '@/styles/landlordStyles';
import { getPropertyById } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  // Fetch property data server-side to pre-fill the form
  const propertyId = parseInt(id);
  const propertyResponse = await getPropertyById(propertyId);

  const initialData = propertyResponse.isSuccess ? propertyResponse.data : null;
  return (
    <EditPropertyForm
      token={session.token}
      propertyId={propertyId}
      initialData={initialData}
      initialError={initialData ? null : propertyResponse.message || 'Failed to load property data'}
    />
  );
}
