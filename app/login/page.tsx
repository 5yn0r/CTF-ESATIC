'use client';

import { useState } from 'react';
import { loginUser, loginWithGoogle } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      await loginUser(email, password);
    } catch (err) {
      setError('Impossible de se connecter. Vérifiez vos identifiants.');
    }
  }

  return (
    <div className="main-shell py-20">
      <div className="mx-auto max-w-md space-y-8 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Connexion</h1>
          <p className="mt-2 text-slate-600">Connectez-vous pour participer aux CTF et accéder à votre tableau de bord.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-brand-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Mot de passe</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-brand-500" />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="w-full rounded-full bg-brand-500 px-4 py-3 text-white hover:bg-brand-700">Se connecter</button>
        </form>
        <div className="border-t border-slate-200 pt-5">
          <button onClick={loginWithGoogle} className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Connexion avec Google
          </button>
          <p className="mt-4 text-center text-sm text-slate-500">
            Pas encore de compte ? <Link href="/register" className="text-brand-600 hover:underline">Inscription</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
