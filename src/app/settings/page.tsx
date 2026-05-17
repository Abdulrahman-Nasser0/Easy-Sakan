export const dynamic = "force-dynamic";

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "Admin") {
    redirect("/admin/dashboard");
  }

  return (
    <SettingsForm
      token={session.token}
      role={session.role as 'Student' | 'Landlord'}
      userEmail={session.email}
      userName={session.name}
    />
  );
}
