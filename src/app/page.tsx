"use client";

import Link from "next/link";
import { Button } from "@/components/common/Button";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check session from the API
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data?.role) {
            setIsAuthenticated(true);
            setUserRole(data.role);
          }
        }
      } catch (error) {
        console.error("Failed to check auth:", error);
      }
    };
    checkAuth();
  }, []);
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              animation: "grid-move 20s linear infinite",
            }}
          ></div>
        </div>

        {/* Floating Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm mb-8">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm font-medium text-blue-100">
                Premium Property Booking
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Find Your Perfect
              <span className="block mt-2 bg-linear-to-r from-blue-400 via-cyan-400 to-indigo-400 text-transparent bg-clip-text">
                Home & Stay
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Easy Sakan - Book luxury properties and accommodations for your next getaway. Discover premium
              stays tailored to your lifestyle.
            </p>
            
            {/* Conditional buttons based on auth status */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated ? (
                <>
                  <Link href="/login">
                    <Button
                      variant="primary"
                      size="lg"
                      rightIcon={
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      }
                    >
                      Explore Properties
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="secondary" size="lg">
                      Create Account
                    </Button>
                  </Link>
                </>
              ) : userRole === 'Admin' ? (
                <>
                  <Link href="/admin/dashboard">
                    <Button
                      variant="primary"
                      size="lg"
                      rightIcon={
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      }
                    >
                      Admin Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={userRole === 'Landlord' ? "/dashboard/landlord" : "/dashboard/student"}>
                    <Button
                      variant="primary"
                      size="lg"
                      rightIcon={
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      }
                    >
                      Continue Browsing
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">5K+</div>
                <div className="text-sm text-blue-200">Properties</div>
              </div>
              <div className="text-center border-x border-blue-400/20">
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-sm text-blue-200">Happy Guests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-blue-200">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="rgb(248 250 252)"
              fillOpacity="1"
            />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-linear-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-linear-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-semibold mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-slate-900 via-indigo-900 to-purple-900 text-transparent bg-clip-text mb-4">
              The Easy Sakan Advantage
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Excellence in every aspect, from booking to support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 4l4 2m-2-2l4-2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Properties</h3>
                <p className="text-gray-600 leading-relaxed">
                  Handpicked luxury properties with verified listings and authentic reviews
                </p>
              </div>
            </div>

            <div className="group relative text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  24/7 dedicated support team to assist with bookings and inquiries
                </p>
              </div>
            </div>

            <div className="group relative text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-linear-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-green-500/50 transition-shadow">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Best Value</h3>
                <p className="text-gray-600 leading-relaxed">
                  Competitive pricing with exclusive deals for registered members
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-linear-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Happy Guests</div>
            </div>
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">5K+</div>
              <div className="text-blue-100">Properties</div>
            </div>
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Book Your Perfect Stay?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of satisfied guests who found their ideal accommodation with Easy Sakan.
          </p>
          <Link href="/signup">
            <Button variant="primary" size="lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Easy Sakan</h3>
              <p className="text-gray-400">
                Your trusted platform for booking premium properties and accommodations worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Browse Properties
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@easysakan.com</li>
                <li>1-800-EASYSAKAN</li>
                <li>Sat-Thu 11AM-10PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Easy Sakan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
