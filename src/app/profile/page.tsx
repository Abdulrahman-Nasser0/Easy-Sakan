export const dynamic = 'force-dynamic';

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/api";
import ProfileContent from "./ProfileContent";

export default async function Profile() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === 'Admin') {
    redirect("/admin/dashboard");
  }

  let university: string | undefined;
  if (session.role === 'Student') {
    try {
      const profileRes = await getProfile(session.token);
      if (profileRes.isSuccess && profileRes.data) {
        university = profileRes.data.university || profileRes.data.universityName || undefined;
      }
    } catch { /* non-fatal */ }
  }

  return <ProfileContent session={session} university={university} />;
}
