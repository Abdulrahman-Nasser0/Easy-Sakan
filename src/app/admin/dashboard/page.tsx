export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import Link from 'next/link';
import { layout, card, header } from '@/styles/designTokens';

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Access denied. Please log in as an admin.</p>
      </div>
    );
  }

  const adminSections = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: '📊', desc: 'Overview & statistics', color: 'bg-sky-500/20' },
    { title: 'Users', href: '/admin/users', icon: '👥', desc: 'Manage user accounts', color: 'bg-emerald-500/20' },
    { title: 'Properties', href: '/admin/properties', icon: '🏠', desc: 'Review property listings', color: 'bg-amber-500/20' },
    { title: 'Bookings', href: '/admin/bookings', icon: '📅', desc: 'Manage all bookings', color: 'bg-purple-500/20' },
    { title: 'Reports', href: '/admin/reports', icon: '🚨', desc: 'User reports & issues', color: 'bg-red-500/20' },
    { title: 'Fraud Detection', href: '/admin/fraud-detection', icon: '🔍', desc: 'ML fraud analysis', color: 'bg-orange-500/20' },
    { title: 'Audit Log', href: '/admin/audit-log', icon: '📋', desc: 'Admin action history', color: 'bg-cyan-500/20' },
  ];

  return (
    <div className={layout.page}>
      <div className="bg-gradient-to-r from-sky-900/50 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-white">🛡️ Admin Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">Welcome, {session.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.filter(s => s.href !== '/admin/dashboard').map(section => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-sky-500/50 transition-all"
            >
              <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center text-xl mb-4`}>
                {section.icon}
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-sky-400 transition-colors">
                {section.title}
              </h3>
              <p className="text-slate-400 text-sm mt-1">{section.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
