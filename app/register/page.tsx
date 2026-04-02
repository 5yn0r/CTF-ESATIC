'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/auth';
import Link from 'next/link';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Pour l'état de chargement
  const [showPassword, setShowPassword] = useState(false); // Pour la visibilité du mot de passe
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return; // Empêcher les soumissions multiples

    setError('');
    setLoading(true);

    try {
      await registerUser(email, password, displayName);
      // En cas de succès, rediriger vers le tableau de bord
      router.push('/dashboard');
    } catch (err: any) {
      let errorMessage = 'Impossible de créer le compte. ';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage += 'Cette adresse email est déjà utilisée.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage += 'Le mot de passe doit contenir au moins 6 caractères.';
      } else {
        errorMessage += 'Vérifiez vos informations.';
      }
      setError(errorMessage);
      setLoading(false); // Arrêter le chargement uniquement en cas d'erreur
    }
  }

  return (
    <div className="main-shell py-20">
      <div className="mx-auto max-w-md space-y-8 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Inscription</h1>
          <p className="mt-2 text-slate-600">Créez votre compte pour rejoindre les CTF du club ESATIC.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Pseudo</label>
            <input 
              type="text" 
              required 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-brand-500" 
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-brand-500" 
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Mot de passe</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-brand-500" 
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 flex items-center px-4 text-sm text-slate-600 hover:text-slate-900"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button 
            type="submit" 
            className="w-full rounded-full bg-brand-500 px-4 py-3 text-white hover:bg-brand-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Créer un compte'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Déjà membre ? <Link href="/login" className="text-brand-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
