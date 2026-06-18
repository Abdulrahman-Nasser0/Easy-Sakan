"use client";

import Link from "next/link";
import { Button } from "@/components/common/Button";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
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
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0071c2] via-[#005999] to-[#004a7d]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-white mr-2"></span>
              <span className="text-sm font-medium text-white">
                Premium Property Booking
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Find Your Perfect
              <span className="block mt-2 text-white/90">
                Home & Stay
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              Easy Sakan - Book luxury properties and accommodations for your next getaway. Discover premium
              stays tailored to your lifestyle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/properties">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={
                    <svg
                      className="w-5 h-5"
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
                  Browse Properties
                </Button>
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link href="/signup">
                    <Button variant="secondary" size="lg">
                      Create Account
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              ) : userRole === 'Admin' ? (
                <Link href="/admin/dashboard">
                  <Button variant="secondary" size="lg">
                    Admin Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href={userRole === 'Landlord' ? "/dashboard/landlord" : "/dashboard/student"}>
                  <Button variant="secondary" size="lg">
                    Continue Browsing
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">5K+</div>
                <div className="text-sm text-white/70">Properties</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-sm text-white/70">Happy Guests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-white/70">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#ebf3ff] border border-[#0071c2]/20 text-[#0071c2] text-sm font-semibold mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] mb-4">
              The Easy Sakan Advantage
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Excellence in every aspect, from booking to support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white border border-gray-200 rounded-lg hover:border-[#0071c2]/50 transition-all shadow-sm">
              <div className="w-16 h-16 bg-[#0071c2] rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 4l4 2m-2-2l4-2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Premium Properties</h3>
              <p className="text-gray-600 leading-relaxed">
                Handpicked luxury properties with verified listings and authentic reviews
              </p>
            </div>

            <div className="text-center p-8 bg-white border border-gray-200 rounded-lg hover:border-[#0071c2]/50 transition-all shadow-sm">
              <div className="w-16 h-16 bg-[#0071c2] rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Expert Support</h3>
              <p className="text-gray-600 leading-relaxed">
                24/7 dedicated support team to assist with bookings and inquiries
              </p>
            </div>

            <div className="text-center p-8 bg-white border border-gray-200 rounded-lg hover:border-[#0071c2]/50 transition-all shadow-sm">
              <div className="w-16 h-16 bg-[#0071c2] rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Best Value</h3>
              <p className="text-gray-600 leading-relaxed">
                Competitive pricing with exclusive deals for registered members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-[#0071c2] to-[#005999]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">50K+</div>
              <div className="text-white/80">Happy Guests</div>
            </div>
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">5K+</div>
              <div className="text-white/80">Properties</div>
            </div>
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Support</div>
            </div>
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">98%</div>
              <div className="text-white/80">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-[#ebf3ff]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4">
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
      <footer className="bg-white border-t border-gray-200 text-gray-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-4">Easy Sakan</h3>
              <p className="text-gray-600">
                Your trusted platform for booking premium properties and accommodations worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1a1a2e] mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/login" className="hover:text-[#0071c2] transition-colors">
                    Browse Properties
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-[#0071c2] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-[#0071c2] transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1a1a2e] mb-4">Account</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/login" className="hover:text-[#0071c2] transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-[#0071c2] transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1a1a2e] mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-600">
                <li>support@easysakan.com</li>
                <li>1-800-EASYSAKAN</li>
                <li>Sat-Thu 11AM-10PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p>&copy; 2026 Easy Sakan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
