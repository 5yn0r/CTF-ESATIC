'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';

export default function ChallengePage() {
  const params = useParams();
  const challengeId = params.challengeId as string;
  const [challenge, setChallenge] = useState<any>(null);
  const [submission, setSubmission] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!challengeId) return;
    const challengeRef = doc(db, 'challenges', challengeId);
    const unsubscribe = onSnapshot(challengeRef, (docSnap) => {
      if (docSnap.exists()) setChallenge({ id: docSnap.id, ...docSnap.data() });
    });
    return () => unsubscribe();
  }, [challengeId]);

  useEffect(() => {
    if (!user) return;
    const solvedQuery = query(collection(db, 'solves'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(solvedQuery, (snapshot) => {
      setSolvedIds(snapshot.docs.map((doc) => doc.data().challengeId as string));
    });
    return () => unsubscribe();
  }, [user]);

  const isSolved = useMemo(() => solvedIds.includes(challengeId), [challengeId, solvedIds]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setMessage('Vous devez être connecté pour soumettre un flag.');
      return;
    }
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/submit-flag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({ challengeId, ctfId: challenge?.ctfId, flag: submission }),
      });

      const data = await response.json();
      setMessage(data.message || 'Réponse reçue.');
    } catch (err) {
      setMessage('Erreur pendant la soumission. Réessayez.');
    } finally {
      setSubmitting(false);
      setSubmission('');
    }
  }

  return (
    <div>
      <Navbar />
      <main className="main-shell py-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-brand-700">Challenge</p>
                  <h1 className="mt-3 text-3xl font-semibold text-slate-900">{challenge?.title ?? 'Chargement...'}</h1>
                </div>
                <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">{challenge?.category}</span>
              </div>
              <div className="mt-6 space-y-4 text-slate-600">
                <p>{challenge?.description}</p>
                {challenge?.externalUrl ? (
                  <p>
                    Lien externe :{' '}
                    <a href={challenge.externalUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                      Ouvrir l’instance
                    </a>
                  </p>
                ) : null}
                {challenge?.fileUrl ? (
                  <p>
                    Fichier disponible :{' '}
                    <a href={challenge.fileUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                      Télécharger
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Soumettre un flag</h2>
              <p className="mt-2 text-sm text-slate-600">Le flag doit être envoyé depuis votre compte. Les validations sont sécurisées côté serveur.</p>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Flag</label>
                  <input value={submission} required onChange={(e) => setSubmission(e.target.value)} placeholder="flag{...}" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-brand-500" />
                </div>
                {message ? <p className="text-sm text-slate-700">{message}</p> : null}
                <button type="submit" disabled={submitting} className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                  {isSolved ? 'Challenge déjà résolu' : submitting ? 'Soumission...' : 'Valider le flag'}
                </button>
              </form>
            </div>
          </section>
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Détails</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">Points : {challenge?.points ?? '...'}</p>
              <p className="text-sm leading-7 text-slate-600">Statut : {isSolved ? 'Résolu' : 'Non résolu'}</p>
              <p className="mt-4 text-sm text-slate-500">Les flags sont stockés sous forme de hash côté serveur et ne sont jamais exposés dans l’interface.</p>
            </div>
            {challenge?.hints?.length ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-slate-900">Hints</h2>
                <div className="mt-4 space-y-4 text-slate-600">
                  {challenge.hints.map((hint: any) => (
                    <div key={hint.id} className="rounded-3xl bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">Indice (-{hint.cost} pts)</p>
                      <p className="mt-2 text-sm">{hint.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </main>
    </div>
  );
}
