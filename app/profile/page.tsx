'use client';

import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile'; // Importer le hook centralisé
import { Navbar } from '@/components/Navbar';
import SolvedChallenges from '@/components/SolvedChallenges';
import Link from 'next/link';

// Ce type est maintenant redondant car géré par le hook, mais on le garde pour la clarté
type ProfileData = {
  displayName: string;
  email: string;
  score: number;
  solvedCount: number;
  solvedChallenges: string[];
};

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  // On remplace le state local par le hook centralisé
  const { profile, loading: profileLoading } = useUserProfile(user?.uid);

  // L'état de chargement global dépend de l'authentification ET du chargement du profil
  const loading = authLoading || profileLoading;

  if (loading) {
    return (
      <div>
        <Navbar />
        <main className="main-shell flex items-center justify-center py-12">
          <p>Chargement du profil...</p>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Navbar />
        <main className="main-shell py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-soft">
            <h1 className="text-3xl font-semibold text-slate-900">Accès refusé</h1>
            <p className="mt-4 text-slate-600">Vous devez être connecté pour voir votre profil.</p>
            <Link href="/login" className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-700">
              Se connecter
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="main-shell py-12">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h1 className="text-3xl font-semibold text-slate-900">Mon profil</h1>
            <p className="mt-2 text-slate-600">Gérez votre compte, consultez votre score et votre historique de challenges.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Informations</h2>
              <div className="mt-6 space-y-3 text-slate-600">
                <p><span className="font-semibold text-slate-900">Nom :</span> {profile?.displayName ?? '...'}</p>
                <p><span className="font-semibold text-slate-900">Email :</span> {profile?.email ?? '...'}</p>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Stats</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Score total</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{profile?.score ?? 0}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Challenges résolus</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{profile?.solvedChallenges?.length ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Historique des challenges résolus</h2>
              {profile?.solvedChallenges && profile.solvedChallenges.length > 0 ? (
                <SolvedChallenges solvedChallengeIds={profile.solvedChallenges} />
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-600">Vous n'avez encore résolu aucun challenge.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
