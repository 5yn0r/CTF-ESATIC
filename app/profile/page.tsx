'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';

type ProfileData = {
  displayName: string;
  email: string;
  score: number;
  solvedCount: number;
  solvedChallenges: string[];
  role: string;
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as ProfileData);
      }
    });
    return () => unsubscribe();
  }, [user]);

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
                <p><span className="font-semibold text-slate-900">Rôle :</span> {profile?.role ?? '...'}</p>
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
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{profile?.solvedCount ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Historique</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Vous avez résolu {profile?.solvedChallenges?.length ?? 0} challenges. Les détails sont consignés dans la collection Firestore sécurisée.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
