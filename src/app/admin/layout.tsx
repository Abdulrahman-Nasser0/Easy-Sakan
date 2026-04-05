// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redirect non-admins to dashboard
  if (!session || session.role !== 'Admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {children}
    </div>
  );
}
