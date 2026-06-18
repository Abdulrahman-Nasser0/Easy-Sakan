export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import Link from 'next/link';
import { layout, card, header } from '@/styles/designTokens';

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-[#cc0000]">
        <p>Access denied. Please log in as an admin.</p>
      </div>
    );
  }

  const adminSections = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: '📊', desc: 'Overview & statistics', color: 'bg-[#ebf3ff]' },
    { title: 'Users', href: '/admin/users', icon: '👥', desc: 'Manage user accounts', color: 'bg-[#ebf7eb]' },
    { title: 'Properties', href: '/admin/properties', icon: '🏠', desc: 'Review property listings', color: 'bg-[#fff3e0]' },
    { title: 'Bookings', href: '/admin/bookings', icon: '📅', desc: 'Manage all bookings', color: 'bg-[#f3e5f5]' },
    { title: 'Reports', href: '/admin/reports', icon: '🚨', desc: 'User reports & issues', color: 'bg-[#fff0f0]' },
    { title: 'Fraud Detection', href: '/admin/fraud-detection', icon: '🔍', desc: 'ML fraud analysis', color: 'bg-[#fff3e0]' },
    { title: 'Audit Log', href: '/admin/audit-log', icon: '📋', desc: 'Admin action history', color: 'bg-[#e0f2fe]' },
  ];

  return (
    <div className={layout.page}>
      <div className="bg-gradient-to-r from-[#0071c2]/50 via-[#005999] to-[#004a7d] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-white">🛡️ Admin Dashboard</h1>
          <p className="text-white/80 mt-1 text-sm">Welcome, {session.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.filter(s => s.href !== '/admin/dashboard').map(section => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-[#0071c2]/50 transition-all shadow-sm"
            >
              <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center text-xl mb-4`}>
                {section.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a2e] group-hover:text-[#0071c2] transition-colors">
                {section.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{section.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
