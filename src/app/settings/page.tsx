export const dynamic = "force-dynamic";

import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Please log in to access settings.</p>
      </div>
    );
  }

  if (session.role === "Admin") {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Admin panel has no settings page.</p>
        <Link href="/admin/dashboard" className="text-blue-600">
          Back to admin dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <Link
            href={session.role === "Landlord" ? "/dashboard/landlord" : "/dashboard/student"}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Placeholder for settings UI */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600">
                Settings page is under development. Coming soon:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                <li>✓ Change password</li>
                <li>✓ Update profile information</li>
                <li>✓ Notification preferences</li>
                <li>✓ Privacy settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
