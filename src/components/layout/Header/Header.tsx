"use client";

import { useMenuState } from "@/hooks/useMenuState";
import PromotionalBanner from "./PromotionalBanner";
import Logo from "./Logo";
import DesktopNavigation from "./DesktopNavigation";
import SearchBar from "./SearchBar";
import UserActions from "./UserActions";
import MobileMenu from "./MobileMenu";

import { UserRole } from "@/lib/types";

interface HeaderProps {
  isAuthenticated?: boolean;
  userRole?: UserRole;
}

export default function Header({ isAuthenticated = false, userRole }: HeaderProps) {
  const [isMenuOpen, toggleMenu, setIsMenuOpen] = useMenuState();

  return (
    <>
      {/* <PromotionalBanner /> */}

      <nav className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md shadow-lg border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left: Logo */}
            <div className="flex items-center shrink-0">
              <Logo />
            </div>

            {/* Center: Navigation & Search */}
            <div className="hidden lg:flex items-center flex-1 justify-center gap-8 max-w-2xl">
              <DesktopNavigation />
              {/* <div className="flex-1 max-w-md">
                <SearchBar />
              </div> */}
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center gap-3">
              <UserActions isAuthenticated={isAuthenticated} userRole={userRole} />

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all duration-200"
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
