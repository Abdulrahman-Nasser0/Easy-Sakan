export const dynamic = 'force-dynamic';

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ProfileContent from "./ProfileContent";

export default async function Profile() {
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  // Redirect admins to admin dashboard
  if (session.role === 'Admin') {
    redirect("/admin/dashboard");
  }

  return <ProfileContent session={session} />;
}
