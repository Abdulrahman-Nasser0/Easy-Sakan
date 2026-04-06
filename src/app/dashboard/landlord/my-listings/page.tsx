// Server Component - Gets session and passes token to client component
import { getSession } from '@/lib/session';
import MyListingsForm from './MyListingsForm';

export const dynamic = 'force-dynamic';

export default async function MyListingsPage() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load. Please log in again.</p>
      </div>
    );
  }

  return <MyListingsForm token={session.token} />;
}
