import { getSession } from '@/lib/session';
import EditPropertyForm from './EditPropertyForm';
import { getPropertyById } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center max-w-md">
          <div className="text-4xl mb-4 opacity-40">🔐</div>
          <p className="text-gray-500">Authentication required. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (session.role !== 'Landlord' && session.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center max-w-md">
          <div className="text-4xl mb-4 opacity-40">⛔</div>
          <p className="text-gray-500">Access Denied. Only Landlords can edit properties.</p>
        </div>
      </div>
    );
  }

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
