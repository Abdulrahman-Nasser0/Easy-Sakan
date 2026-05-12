/**
 * /dashboard — redirect to role-specific dashboard
 * This page handles the redirect after login or when someone goes directly to /dashboard
 */

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardRedirect() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Redirect based on role
  if (session.role === "Admin") {
    redirect("/admin/dashboard");
  } else if (session.role === "Landlord") {
    redirect("/dashboard/landlord");
  } else {
    redirect("/dashboard/student");
  }
}
