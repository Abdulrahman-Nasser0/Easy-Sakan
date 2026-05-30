export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ReportIssuePageClient from './ReportIssuePageClient';

export default async function ReportIssuePage() {
  const session = await getSession();

  if (!session?.token) {
    redirect('/login');
  }

  return <ReportIssuePageClient token={session.token} userName={session.name} userEmail={session.email} />;
}
