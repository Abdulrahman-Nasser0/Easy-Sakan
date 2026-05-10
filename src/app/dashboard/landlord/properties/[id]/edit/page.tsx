import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import EditPropertyForm from './EditPropertyForm';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session?.token) {
    redirect('/login');
  }

  // Ensure only landlords can access
  if (session.role !== 'Landlord' && session.role !== 'Admin') {
    redirect('/dashboard/student');
  }

  return <EditPropertyForm token={session.token} propertyId={parseInt(params.id)} />;
}
