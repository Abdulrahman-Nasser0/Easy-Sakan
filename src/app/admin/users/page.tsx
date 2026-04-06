// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import UsersManagement from './UsersManagement';

export default async function AdminUsers() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load users. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <UsersManagement token={session.token} />
    </div>
  );
}
