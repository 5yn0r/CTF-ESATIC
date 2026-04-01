'use client';

import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Navbar } from '../../components/Navbar';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuth } from '../../hooks/useAuth';

type CtfEvent = { id: string; title: string; active: boolean; description: string; startAt: any; endAt: any; createdAt: any; };
type UserAdmin = { id: string; displayName: string; email: string; role: string; score: number };
type ChallengeAdmin = {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  flag: string;
  ctfId: string;
  active: boolean;
  difficulty: string;
  externalLink?: string;
  createdAt: any;
};

export default function AdminPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(user?.uid);
  const [ctfs, setCtfs] = useState<CtfEvent[]>([]);
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [challenges, setChallenges] = useState<ChallengeAdmin[]>([]);
  
  const [newCtf, setNewCtf] = useState({ title: '', description: '', startAt: '', endAt: '', active: true });
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', category: 'Web', points: 100, flag: '', ctfId: '', active: true, difficulty: 'easy' });

  const [editingChallenge, setEditingChallenge] = useState<ChallengeAdmin | null>(null);
  const [activeTab, setActiveTab] = useState('ctfs');

  useEffect(() => {
    const ctfsQuery = query(collection(db, 'ctfs'), orderBy('createdAt', 'desc'));
    const usersQuery = query(collection(db, 'users'), orderBy('score', 'desc'));
    const challengesQuery = query(collection(db, 'challenges'), orderBy('createdAt', 'desc'));

    const unsubCtfs = onSnapshot(ctfsQuery, (snap) => setCtfs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CtfEvent))));
    const unsubUsers = onSnapshot(usersQuery, (snap) => setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserAdmin))));
    const unsubChalls = onSnapshot(challengesQuery, (snap) => setChallenges(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChallengeAdmin))));

    return () => { unsubCtfs(); unsubUsers(); unsubChalls(); };
  }, []);

  async function createCtf(e: React.FormEvent) {
    e.preventDefault();
    if (!newCtf.title || !newCtf.description || !newCtf.startAt || !newCtf.endAt) { return; }
    await addDoc(collection(db, 'ctfs'), { ...newCtf, startAt: new Date(newCtf.startAt), endAt: new Date(newCtf.endAt), createdAt: serverTimestamp() });
    setNewCtf({ title: '', description: '', startAt: '', endAt: '', active: true });
  }

  async function createChallenge(e: React.FormEvent) {
    e.preventDefault();
    if (!newChallenge.title || !newChallenge.description || !newChallenge.flag || !newChallenge.ctfId) { return; }
    await addDoc(collection(db, 'challenges'), { ...newChallenge, createdAt: serverTimestamp() });
    setNewChallenge({ title: '', description: '', category: 'Web', points: 100, flag: '', ctfId: '', active: true, difficulty: 'easy' });
  }

  async function handleUpdateChallenge(e: React.FormEvent) {
    e.preventDefault();
    if (!editingChallenge) return;
    const { id, ...dataToUpdate } = editingChallenge;
    await updateDoc(doc(db, 'challenges', id), dataToUpdate);
    setEditingChallenge(null);
  }

  const removeDoc = (coll: string, id: string) => async () => await deleteDoc(doc(db, coll, id));
  const updateUserRole = (uid: string, newRole: string) => async () => await updateDoc(doc(db, 'users', uid), { role: newRole });

  if (profileLoading) return <p>Chargement...</p>;
  if (!profile || profile.role !== 'admin') return <p>Accès refusé.</p>;

  const tabButton = (tab: string, label: string) => (
    <button onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium ${activeTab === tab ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}>
      {label}
    </button>
  );

  return (
    <div>
      <Navbar />
      <main className="main-shell py-12">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-3xl font-semibold text-slate-900">Tableau de bord Administrateur</h1>
              <p className="mt-2 text-slate-600">Gérez les événements, les challenges et les utilisateurs.</p>
            </div>
            <div className="mt-6"><nav className="-mb-px flex space-x-8">{tabButton('ctfs', 'CTFs')}{tabButton('challenges', 'Challenges')}{tabButton('users', 'Utilisateurs')}</nav></div>

            <div className="mt-8">
              {/* ONGLET CTFS (RESTAURÉ) */}
              {activeTab === 'ctfs' && 
                <div className="grid gap-8 lg:grid-cols-2"> 
                  <section> 
                    <h2 className="text-xl font-semibold text-slate-900">Créer un CTF</h2> 
                    <form className="mt-5 space-y-4" onSubmit={createCtf}>
                      <input value={newCtf.title} onChange={(e) => setNewCtf({...newCtf, title: e.target.value})} placeholder="Titre du CTF" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                      <textarea value={newCtf.description} onChange={(e) => setNewCtf({...newCtf, description: e.target.value})} placeholder="Description du CTF" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"></textarea>
                      <input type="datetime-local" value={newCtf.startAt} onChange={(e) => setNewCtf({...newCtf, startAt: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                      <input type="datetime-local" value={newCtf.endAt} onChange={(e) => setNewCtf({...newCtf, endAt: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={newCtf.active} onChange={(e) => setNewCtf({...newCtf, active: e.target.checked})} id="ctf-active" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
                        <label htmlFor="ctf-active" className="text-sm text-slate-700">Actif</label>
                      </div>
                      <button type='submit' className="w-full rounded-full bg-brand-500 px-4 py-3 text-white hover:bg-brand-700">Ajouter CTF</button>
                    </form>
                  </section>
                  <section>
                    <h2 className="text-xl font-semibold text-slate-900">CTFs Existants</h2>
                    <div className="mt-5 space-y-4">{ctfs.map(ctf => <div key={ctf.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4"><p className="font-semibold text-slate-900">{ctf.title}</p><button onClick={removeDoc('ctfs', ctf.id)} className="rounded-full bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200">Supprimer</button></div>)}</div>
                  </section>
                </div>}

              {/* ONGLET CHALLENGES */}
              {activeTab === 'challenges' && 
                <div className="grid gap-8 lg:grid-cols-2">
                  <section>
                    <h2 className="text-xl font-semibold text-slate-900">Ajouter un Challenge</h2>
                    <form className="mt-5 space-y-4" onSubmit={createChallenge}>
                      <input value={newChallenge.title} onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })} placeholder="Titre" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                      <textarea value={newChallenge.description} onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })} placeholder="Description" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"></textarea>
                      <select value={newChallenge.category} onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <option>Web</option><option>Crypto</option><option>Pwn</option><option>Reverse</option><option>Forensics</option><option>OSINT</option>
                      </select>
                      <input type="number" value={newChallenge.points} onChange={(e) => setNewChallenge({ ...newChallenge, points: Number(e.target.value) })} placeholder="Points" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                      <input value={newChallenge.flag} onChange={(e) => setNewChallenge({ ...newChallenge, flag: e.target.value })} placeholder="Flag" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                      <select value={newChallenge.ctfId} onChange={(e) => setNewChallenge({ ...newChallenge, ctfId: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <option value="">Sélectionner un CTF</option>
                        {ctfs.map(ctf => <option key={ctf.id} value={ctf.id}>{ctf.title}</option>)}
                      </select>
                       <div className="flex items-center gap-2">
                        <input type="checkbox" checked={newChallenge.active} onChange={(e) => setNewChallenge({...newChallenge, active: e.target.checked})} id="challenge-new-active" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
                        <label htmlFor="challenge-new-active" className="text-sm text-slate-700">Actif par défaut</label>
                      </div>
                      <button type='submit' className="w-full rounded-full bg-brand-500 px-4 py-3 text-white hover:bg-brand-700">Ajouter Challenge</button>
                    </form>
                  </section>
                  <section>
                    <h2 className="text-xl font-semibold text-slate-900">Challenges Existants</h2>
                    <div className="mt-5 space-y-4">{challenges.length > 0 ? challenges.map(c => <div key={c.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4"><div><p className="font-semibold text-slate-900">{c.title}</p><div className='flex items-center gap-2'><span className={`inline-block h-2 w-2 rounded-full ${c.active ? 'bg-green-500' : 'bg-slate-400'}`}></span><p className="text-sm text-slate-600">{c.category} - {c.points} pts</p></div></div><div className='flex items-center gap-2'><button onClick={() => setEditingChallenge(c)} className="rounded-full bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200">Modifier</button><button onClick={removeDoc('challenges', c.id)} className="rounded-full bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200">Supprimer</button></div></div>) : <p className='text-slate-500 text-center py-8'>Aucun challenge créé.</p>}</div>
                  </section>
                </div>}
              
              {/* ONGLET USERS (RESTAURÉ) */}
              {activeTab === 'users' && <section><h2 className="text-xl font-semibold text-slate-900">Utilisateurs</h2><div className="mt-5 flow-root"><div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"><div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"><table className="min-w-full divide-y divide-slate-300"><thead><tr><th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-0">Nom</th><th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Score</th><th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Rôle</th><th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Action</span></th></tr></thead><tbody className="divide-y divide-slate-200">{users.map(u => <tr key={u.id}> <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0"><div className="font-medium text-slate-900">{u.displayName}</div><div className="text-slate-500">{u.email}</div></td><td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{u.score}</td><td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 capitalize">{u.role}</td><td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">{u.role !== 'admin' ? <button onClick={updateUserRole(u.id, 'admin')} className="text-brand-600 hover:text-brand-900">Promouvoir Admin</button> : <button onClick={updateUserRole(u.id, 'user')} className="text-slate-600 hover:text-slate-900">Rétrograder</button>}</td></tr>)}</tbody></table></div></div></div></section>}

            </div>
          </div>
        </div>
      </main>

      {/* MODALE D'ÉDITION DE CHALLENGE */}
      {editingChallenge && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
            <form onSubmit={handleUpdateChallenge} className="p-8 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Modifier le Challenge</h2>
              <input value={editingChallenge.title} onChange={(e) => setEditingChallenge({ ...editingChallenge, title: e.target.value })} placeholder="Titre" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              <textarea value={editingChallenge.description} onChange={(e) => setEditingChallenge({ ...editingChallenge, description: e.target.value })} placeholder="Description" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 h-32"></textarea>
              <div className='grid grid-cols-2 gap-4'>
                <input type="number" value={editingChallenge.points} onChange={(e) => setEditingChallenge({ ...editingChallenge, points: Number(e.target.value) })} placeholder="Points" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                <input value={editingChallenge.flag} onChange={(e) => setEditingChallenge({ ...editingChallenge, flag: e.target.value })} placeholder="Flag" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                <select value={editingChallenge.category} onChange={(e) => setEditingChallenge({ ...editingChallenge, category: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <option>Web</option><option>Crypto</option><option>Pwn</option><option>Reverse</option><option>Forensics</option><option>OSINT</option>
                </select>
                <select value={editingChallenge.difficulty} onChange={(e) => setEditingChallenge({ ...editingChallenge, difficulty: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                </select>
              </div>
              <input value={editingChallenge.externalLink || ''} onChange={(e) => setEditingChallenge({ ...editingChallenge, externalLink: e.target.value })} placeholder="Lien externe (optionnel)" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <input type="checkbox" checked={editingChallenge.active} onChange={(e) => setEditingChallenge({ ...editingChallenge, active: e.target.checked })} id="challenge-active" className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
                <label htmlFor="challenge-active" className="text-sm font-medium text-slate-800">Challenge Actif</label>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setEditingChallenge(null)} className="rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200">Annuler</button>
                <button type='submit' className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
