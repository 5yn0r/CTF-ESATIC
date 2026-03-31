'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/Navbar';

type ScoreItem = {
  id: string;
  displayName: string;
  score: number;
  solvedCount: number;
};

export default function ScoreboardPage() {
  const [leaders, setLeaders] = useState<ScoreItem[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('score', 'desc'), limit(20));
    return onSnapshot(q, (snapshot) => {
      setLeaders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ScoreItem)));
    });
  }, []);

  return (
    <div>
      <Navbar />
      <main className="main-shell py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-semibold text-slate-900">Classement en temps réel</h1>
          <p className="mt-3 text-slate-600">Suivez les meilleurs scores du club ESATIC et la progression des joueurs.</p>
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200">
            <div className="bg-slate-100 px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Top 20</div>
            <div className="divide-y divide-slate-200 bg-white">
              {leaders.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">{index + 1}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{user.displayName}</p>
                      <p className="text-sm text-slate-500">{user.solvedCount} défis résolus</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">{user.score} pts</p>
                  </div>
                </div>
              ))}
              {leaders.length === 0 ? <p className="p-6 text-slate-500">Aucun score disponible actuellement.</p> : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
