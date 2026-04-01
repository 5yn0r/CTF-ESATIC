'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

type CtfEventItem = {
  id: string;
  title: string;
  description: string;
  active: boolean;
  startAt: Timestamp;
  endAt: Timestamp;
};

export default function DashboardPage() {
  const [ctfs, setCtfs] = useState<CtfEventItem[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'ctfs'), orderBy('startAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCtfs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CtfEventItem)));
    });
    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'Date invalide';
    return timestamp.toDate().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <main className="main-shell flex items-center justify-center py-12">
          <p>Chargement...</p>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Navbar />
        <main className="main-shell py-12 text-center">
            <h1 className="text-3xl font-bold mt-20">Accès refusé</h1>
            <p className="mt-4 text-slate-600">Vous devez être connecté pour accéder au tableau de bord.</p>
            <Link href="/login" className="mt-6 inline-block rounded-full bg-brand-500 px-8 py-3 font-semibold text-white hover:bg-brand-700">
            Se connecter
            </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <main className="main-shell py-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Bienvenue, {user.displayName?.split(' ')[0]}!</h1>
            <p className="mt-2 text-slate-600">Prêt à relever de nouveaux défis ? Trouvez un CTF actif et commencez à résoudre des challenges.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/scoreboard" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors">
              Voir le scoreboard
            </Link>
            <Link href="/profile" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 transition-colors">
              Mon profil
            </Link>
          </div>
        </div>

        <section>
          <div className="rounded-[2rem] bg-white p-6 shadow-soft border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">CTF disponibles</h2>
            <div className="mt-6">
              {ctfs.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-slate-600 text-lg font-semibold">C'est tout bon !</p>
                  <p className="text-slate-500 mt-2">Aucun CTF n'est actif pour le moment. Revenez bientôt !</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ctfs.map((ctf) => (
                    <article key={ctf.id} className="group rounded-3xl border border-slate-200 bg-white hover:border-brand-500 transition-all duration-300 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">{ctf.title}</h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ctf.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                            {ctf.active ? 'Actif' : 'Terminé'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{ctf.description}</p>
                      </div>
                      <div className="mt-6">
                          <div className="text-sm text-slate-500 mb-4">
                            <span>Du {formatDate(ctf.startAt)} au {formatDate(ctf.endAt)}</span>
                          </div>
                          <Link href={`/ctf/${ctf.id}`} className="block w-full text-center rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors">
                            Voir les challenges
                          </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
