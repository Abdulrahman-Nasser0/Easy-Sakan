// Server Component - Gets session and passes token to client component
import { getSession } from '@/lib/session';
import UploadPropertyForm from './UploadPropertyForm';
import { landlordStyles } from '@/styles/landlordStyles';

export const dynamic = 'force-dynamic';

export default async function UploadPropertyPage() {
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

  return <UploadPropertyForm token={session.token} />;
}
