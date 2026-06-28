'use server';

import { getSession, createSession } from '@/lib/session';

export async function refreshSessionAfterProfileUpdate(name: string, email: string) {
  const session = await getSession();
  if (!session) return;

  await createSession(
    session.userId,
    email,
    name,
    session.token,
    session.role,
    session.isVerified,
    session.refreshToken,
    session.tokenExpiresAt,
    session.profileImage
  );
}
