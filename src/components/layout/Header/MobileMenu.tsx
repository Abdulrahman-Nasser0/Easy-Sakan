import Link from "next/link";
import SearchBar from "./SearchBar";
import { Button } from "@/components/common/Button";

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isAuthenticated?: boolean;
}

export default function MobileMenu({ isMenuOpen, setIsMenuOpen, isAuthenticated = false }: MobileMenuProps) {
  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden border-t border-gray-200 py-4">
      <div className="space-y-4">
        {/* Mobile Search */}
        {/* <SearchBar isMobile={true} onMenuClose={() => setIsMenuOpen(false)} /> */}

        {/* Mobile Navigation - Add booking features here */}
        <div className="space-y-1">
          {/* Navigation items for booking features */}
        </div>

        {/* Mobile Auth */}
        {!isAuthenticated && (
          <div className="border-t border-gray-200 pt-4 space-y-3 gap-4">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button 
                variant="outline" 
                fullWidth
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                }
              >
                Sign In
              </Button>
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button 
                variant="primary" 
                fullWidth
                className="mt-2"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                }
              >
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}