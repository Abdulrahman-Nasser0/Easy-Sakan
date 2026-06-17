import Link from "next/link";
import AccountDropdown from "./AccountDropdown";
import { UserActionsProps } from "@/lib/types";
import { Button } from "@/components/common/Button";

export default function UserActions({ isAuthenticated = false, userRole, userName }: UserActionsProps) {
  const handleLogout = async () => {
    try {
      const { logout } = await import('@/lib/actions');
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <AccountDropdown isAuthenticated={isAuthenticated} userName={userName} onLogout={handleLogout} />
      </div>
      
      {!isAuthenticated && (
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
      
      {isAuthenticated && userRole !== 'Admin' && (
        <Link href={userRole === 'Landlord' ? "/dashboard/landlord" : "/dashboard/student"} className="hidden md:inline-block">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
      )}
      
      {isAuthenticated && userRole === 'Admin' && (
        <Link href="/admin/dashboard" className="hidden md:inline-block">
          <Button variant="ghost" size="sm">
            Admin Panel
          </Button>
        </Link>
      )}
    </div>
  );
}
