'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

type CtfEventItem = {
  id: string;
  title: string;
  description: string;
  active: boolean;
  startAt: string;
  endAt: string;
};

export default function DashboardPage() {
  const [ctfs, setCtfs] = useState<CtfEventItem[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'ctfs'), orderBy('startAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setCtfs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CtfEventItem)));
    });
  }, []);

  return (
    <div>
      <Navbar />
      <main className="main-shell py-12">
        <div className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">Tableau de bord</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Mes CTF en cours</h1>
            <p className="mt-2 text-slate-600">Accédez aux défis actifs, au classement et à votre progression.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/scoreboard" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              Voir le scoreboard
            </Link>
            <Link href="/profile" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300">
              Mon profil
            </Link>
          </div>
        </div>
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">CTF disponibles</h2>
              <div className="mt-6 space-y-4">
                {ctfs.length === 0 ? (
                  <p className="text-slate-600">Aucun CTF disponible pour le moment.</p>
                ) : (
                  ctfs.map((ctf) => (
                    <article key={ctf.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{ctf.title}</h3>
                          <p className="mt-1 text-sm text-slate-600">{ctf.description}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ctf.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {ctf.active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span>Du {new Date(ctf.startAt).toLocaleDateString()}</span>
                        <span>au {new Date(ctf.endAt).toLocaleDateString()}</span>
                        <Link href={`/ctf/${ctf.id}`} className="rounded-full bg-brand-500 px-4 py-2 text-white hover:bg-brand-700">
                          Voir les challenges
                        </Link>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Bienvenue</h2>
              <p className="mt-3 text-slate-600">
                {loading ? 'Chargement...' : user ? `Connecté en tant que ${user.email}` : 'Connectez-vous pour accéder à vos défis.'}
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Fonctions rapides</h2>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li>- Suivi des challenges résolus</li>
                <li>- Scoreboard live</li>
                <li>- Hints payants</li>
                <li>- Administration sécurisée</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
