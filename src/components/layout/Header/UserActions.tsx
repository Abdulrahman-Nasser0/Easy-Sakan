import Link from "next/link";
import AccountDropdown from "./AccountDropdown";
import { UserActionsProps } from "@/lib/types";
import { Button } from "@/components/common/Button";


export default function UserActions({ isAuthenticated = false, userRole }: UserActionsProps) {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {/* Account Dropdown */}
        <AccountDropdown isAuthenticated={isAuthenticated} />
      </div>
      
      {/* Only show Sign In/Sign Up when NOT authenticated */}
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
      
      {/* Show dashboard link for authenticated users */}
      {isAuthenticated && userRole !== 'Admin' && (
        <Link href={userRole === 'Landlord' ? "/dashboard/landlord" : "/dashboard/student"} className="hidden md:inline-block">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
      )}
      
      {/* Show admin dashboard link for admin users */}
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