'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { logoutUser } from '@/lib/auth';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/scoreboard', label: 'Scoreboard' },
  { href: '/profile', label: 'Profil' },
];

export function Navbar() {
  const { user, loading } = useAuth();
  const { profile } = useUserProfile();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
      <div className="main-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-xl font-semibold text-slate-900">
          CTF ESATIC
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-900">
              {link.label}
            </Link>
          ))}
          {profile?.role === 'admin' ? (
            <Link href="/admin" className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200">
              Admin
            </Link>
          ) : null}
          {loading ? null : user ? (
            <button onClick={() => logoutUser()} className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200">
              Déconnexion
            </button>
          ) : (
            <Link href="/login" className="rounded-full bg-brand-500 px-4 py-2 text-white hover:bg-brand-700">
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
