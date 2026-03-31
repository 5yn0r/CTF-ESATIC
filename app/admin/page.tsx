'use client';

import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/Navbar';

type CtfEvent = {
  id: string;
  title: string;
  active: boolean;
};

type ChallengeAdmin = {
  id: string;
  title: string;
  category: string;
  points: number;
};

type UserAdmin = {
  id: string;
  displayName: string;
  email: string;
  role: string;
  score: number;
};

import { useUserProfile } from '@/hooks/useUserProfile';

export default function AdminPage() {
  const { profile, loading: profileLoading } = useUserProfile();
  const [ctfs, setCtfs] = useState<CtfEvent[]>([]);
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [challenges, setChallenges] = useState<ChallengeAdmin[]>([]);
  const [newCtfTitle, setNewCtfTitle] = useState('');
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newChallengeCategory, setNewChallengeCategory] = useState('Web');
  const [newChallengePoints, setNewChallengePoints] = useState(100);

  useEffect(() => {
    const ctfsQuery = query(collection(db, 'ctfs'), orderBy('createdAt', 'desc'));
    const usersQuery = query(collection(db, 'users'), orderBy('score', 'desc'));
    const challengesQuery = query(collection(db, 'challenges'), orderBy('createdAt', 'desc'));

    const unsubscribeCtfs = onSnapshot(ctfsQuery, (snapshot) => {
      setCtfs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CtfEvent)));
    });
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as UserAdmin)));
    });
    const unsubscribeChallenges = onSnapshot(challengesQuery, (snapshot) => {
      setChallenges(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ChallengeAdmin)));
    });

    return () => {
      unsubscribeCtfs();
      unsubscribeUsers();
      unsubscribeChallenges();
    };
  }, []);

  async function createCtf(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newCtfTitle) return;
    await addDoc(collection(db, 'ctfs'), {
      title: newCtfTitle,
      description: 'Nouvelle compétition CTF prête à démarrer.',
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
      createdAt: serverTimestamp(),
    });
    setNewCtfTitle('');
  }

  async function createChallenge(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newChallengeTitle) return;
    await addDoc(collection(db, 'challenges'), {
      ctfId: ctfs[0]?.id || '',
      title: newChallengeTitle,
      description: 'Description du challenge.',
      category: newChallengeCategory,
      points: newChallengePoints,
      visible: true,
      flagHash: '',
      createdAt: serverTimestamp(),
    });
    setNewChallengeTitle('');
  }

  async function removeCtf(ctfId: string) {
    await deleteDoc(doc(db, 'ctfs', ctfId));
  }

  if (profileLoading) {
    return (
      <div>
        <Navbar />
        <main className="main-shell py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-slate-600">Chargement de votre profil administrateur...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div>
        <Navbar />
        <main className="main-shell py-12">
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 shadow-soft">
            <h1 className="text-3xl font-semibold text-red-700">Accès refusé</h1>
            <p className="mt-3 text-slate-600">Vous devez être administrateur pour voir cette page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="main-shell py-12">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h1 className="text-3xl font-semibold text-slate-900">Admin</h1>
            <p className="mt-3 text-slate-600">Gérez les événements CTF, les challenges et les utilisateurs du club.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Créer un CTF</h2>
              <form className="mt-5 space-y-4" onSubmit={createCtf}>
                <input value={newCtfTitle} onChange={(e) => setNewCtfTitle(e.target.value)} placeholder="Titre du CTF" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                <button className="w-full rounded-full bg-brand-500 px-4 py-3 text-white hover:bg-brand-700">Ajouter un CTF</button>
              </form>
            </section>
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Ajouter un challenge</h2>
              <form className="mt-5 space-y-4" onSubmit={createChallenge}>
                <input value={newChallengeTitle} onChange={(e) => setNewChallengeTitle(e.target.value)} placeholder="Titre challenge" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                <select value={newChallengeCategory} onChange={(e) => setNewChallengeCategory(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <option>Web</option>
                  <option>Crypto</option>
                  <option>Pwn</option>
                  <option>Reverse</option>
                  <option>Forensics</option>
                  <option>OSINT</option>
                </select>
                <input type="number" value={newChallengePoints} onChange={(e) => setNewChallengePoints(Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                <button className="w-full rounded-full bg-brand-500 px-4 py-3 text-white hover:bg-brand-700">Ajouter un challenge</button>
              </form>
            </section>
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Utilisateurs</h2>
              <div className="mt-5 space-y-3 text-slate-600">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{user.displayName}</p>
                    <p className="text-sm">{user.email}</p>
                    <p className="text-sm">Score : {user.score}</p>
                  </div>
                ))}
                {users.length === 0 ? <p>Aucun utilisateur à afficher.</p> : null}
              </div>
            </section>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">CTF existants</h2>
              <div className="mt-5 space-y-4">
                {ctfs.map((ctf) => (
                  <div key={ctf.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                    <div>
                      <p className="font-semibold text-slate-900">{ctf.title}</p>
                      <p className="text-sm text-slate-600">Statut : {ctf.active ? 'Actif' : 'Inactif'}</p>
                    </div>
                    <button onClick={() => removeCtf(ctf.id)} className="rounded-full bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200">
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Challenges</h2>
              <div className="mt-5 space-y-4">
                {challenges.slice(0, 6).map((challenge) => (
                  <div key={challenge.id} className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{challenge.title}</p>
                    <p className="text-sm text-slate-600">{challenge.category} — {challenge.points} pts</p>
                  </div>
                ))}
                {challenges.length === 0 ? <p>Aucun challenge encore créé.</p> : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
