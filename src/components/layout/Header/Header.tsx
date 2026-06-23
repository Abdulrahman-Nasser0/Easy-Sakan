"use client";

import { useMenuState } from "@/hooks/useMenuState";
import Logo from "./Logo";
import DesktopNavigation from "./DesktopNavigation";
import UserActions from "./UserActions";
import MobileMenu from "./MobileMenu";

import { UserRole } from "@/lib/types";
import NotificationBell from "@/components/common/NotificationBell";

interface HeaderProps {
  isAuthenticated?: boolean;
  userRole?: UserRole;
  token?: string;
  userName?: string;
}

export default function Header({ isAuthenticated = false, userRole, token, userName }: HeaderProps) {
  const [isMenuOpen, toggleMenu, setIsMenuOpen] = useMenuState();

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left: Logo */}
            <div className="flex items-center shrink-0">
              <Logo />
            </div>

            {/* Center: Navigation */}
            <div className="hidden lg:flex items-center flex-1 justify-center gap-8 max-w-2xl">
              <DesktopNavigation />
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center gap-1">
              {isAuthenticated && token && <NotificationBell token={token} userRole={userRole} />}
              <UserActions isAuthenticated={isAuthenticated} userRole={userRole} userName={userName} />

              {/* Mobile Menu Button */}
              {!isAuthenticated && (
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-[#0071c2] hover:bg-[#f2f6fc] transition-all duration-200"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
              )}
            </div>
          </div>

          <MobileMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </nav>
    </>
  );
}
