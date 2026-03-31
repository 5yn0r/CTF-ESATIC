'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

type CtfEvent = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  active: boolean;
};

type ChallengeItem = {
  id: string;
  title: string;
  category: string;
  points: number;
  visible: boolean;
};

export default function CtfPage() {
  const params = useParams();
  const ctfId = params.ctfId as string;
  const [ctf, setCtf] = useState<CtfEvent | null>(null);
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);

  useEffect(() => {
    if (!ctfId) return;
    const ctfRef = doc(db, 'ctfs', ctfId);
    const unsubCtf = onSnapshot(ctfRef, (docSnap) => {
      if (docSnap.exists()) {
        setCtf({ id: docSnap.id, ...docSnap.data() } as CtfEvent);
      }
    });

    const challengesQuery = query(collection(db, 'challenges'), where('ctfId', '==', ctfId));
    const unsubChallenges = onSnapshot(challengesQuery, (snapshot) => {
      setChallenges(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ChallengeItem)));
    });

    return () => {
      unsubCtf();
      unsubChallenges();
    };
  }, [ctfId]);

  return (
    <div>
      <Navbar />
      <main className="main-shell py-12">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">CTF</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">{ctf?.title ?? 'Chargement...'}</h1>
                <p className="mt-2 text-slate-600">{ctf?.description}</p>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p>Début : {ctf ? new Date(ctf.startAt).toLocaleString() : '...'}</p>
                <p>Fin : {ctf ? new Date(ctf.endAt).toLocaleString() : '...'}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-4">
              {challenges.map((challenge) => (
                <article key={challenge.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{challenge.title}</h2>
                      <p className="mt-2 text-sm text-slate-500">{challenge.category}</p>
                    </div>
                    <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">{challenge.points} pts</span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/challenge/${challenge.id}`} className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                      Voir le challenge
                    </Link>
                    {challenge.visible ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Visible</span> : <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">Caché</span>}
                  </div>
                </article>
              ))}
              {challenges.length === 0 ? <p className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-slate-600">Aucun challenge trouvé pour ce CTF.</p> : null}
            </section>
            <aside className="space-y-4">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-slate-900">Navigation rapide</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">Consultez les challenges par difficulté et récupérez les indices pour progresser plus vite.</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
