
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/lib/actions";
import { AuthStatusResponse } from "@/lib/types";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorDisplay from "@/components/common/ErrorDisplay";

// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<AuthStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfile();
        // console.log("Profile API Response:", response); // Debug log - commented out
        if (response.isSuccess) {
          setUserData(response.data);
        } else {
          setError(response.message || "Failed to fetch user data");
        }
      } catch (err) {
        setError("An error occurred while fetching user data");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorDisplay
          title="Unable to Load Profile"
          message="We couldn't retrieve your profile information at this moment. This might be a temporary issue with our servers. Please try again shortly."
          actionButton={{
            text: "Try Again",
            onClick: () => window.location.reload()
          }}
        />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorDisplay
          title="Authentication Required"
          message="You need to be logged in to view your profile. Please sign in to continue."
          type="warning"
          actionButton={{
            text: "Go to Login",
            onClick: () => router.push('/login')
          }}
        />
      </div>
    );
  }

  // User data is directly in userData, not userData.user
  const user = userData;
  console.log("User Data:", user); // Debug log
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <p className="mt-1 text-sm text-gray-900">{user.userId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{user.fullName || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-sm text-gray-900">
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                <p className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    user.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Account Status</h2>
          </div>

          <div className="px-6 py-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                user.isVerified ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-gray-900">
                {user.isVerified ? 'Account Verified' : 'Account Pending Verification'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
