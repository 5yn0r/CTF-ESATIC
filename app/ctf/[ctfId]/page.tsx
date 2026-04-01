'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { collection, doc, getDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

type Ctf = { id: string; title: string; description: string; };
type Challenge = {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  difficulty: string;
  active: boolean;
};

export default function CtfPage() {
  const params = useParams();
  const ctfId = params.ctfId as string;
  const { user } = useAuth();
  const { profile: userProfile, loading: profileLoading } = useUserProfile(user?.uid);

  const [ctf, setCtf] = useState<Ctf | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengesLoading, setChallengesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ctfId) return;

    const fetchCtfDetails = async () => {
      const ctfDocRef = doc(db, 'ctfs', ctfId);
      const ctfDocSnap = await getDoc(ctfDocRef);
      if (ctfDocSnap.exists()) {
        setCtf({ id: ctfDocSnap.id, ...ctfDocSnap.data() } as Ctf);
      }
    };

    const challengesQuery = query(
      collection(db, 'challenges'),
      where('ctfId', '==', ctfId),
      where('active', '==', true),
      orderBy('category', 'asc'),
      orderBy('points', 'asc')
    );

    const unsubscribe = onSnapshot(challengesQuery, 
      (snapshot) => {
        setChallenges(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Challenge)));
        setChallengesLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Erreur Firestore (visible en dev):", err.message);
        setError("Une erreur est survenue en chargeant les challenges."); // Message générique pour la prod
        setChallengesLoading(false);
      }
    );

    fetchCtfDetails();
    return () => unsubscribe();
  }, [ctfId]);

  const groupedChallenges = challenges.reduce((acc, challenge) => {
    if (!acc[challenge.category]) acc[challenge.category] = [];
    acc[challenge.category].push(challenge);
    return acc;
  }, {} as Record<string, Challenge[]>);

  if (challengesLoading || profileLoading) {
    return <div><Navbar /><main className="main-shell py-12"><p>Chargement des challenges...</p></main></div>;
  }

  // AFFICHER UN MESSAGE D'ERREUR PROPRE EN PRODUCTION
  if (error) {
    return (
        <div>
            <Navbar />
            <main className="main-shell py-12">
              <div className="text-center py-16 border-2 border-dashed border-red-200 rounded-2xl bg-red-50">
                  <p className="text-red-700 text-lg font-semibold">Erreur de chargement</p>
                  <p className="text-red-600 mt-2">Impossible de charger les challenges pour le moment. Veuillez réessayer plus tard.</p>
              </div>
            </main>
        </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <main className="main-shell py-12">
        {ctf && (
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-slate-900">{ctf.title}</h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">{ctf.description}</p>
          </header>
        )}

        <div className="space-y-12">
          {Object.keys(groupedChallenges).length === 0 ? (
             <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-600 text-lg font-semibold">Aucun challenge actif pour le moment</p>
                <p className="text-slate-500 mt-2">Revenez plus tard !</p>
             </div>
          ) : (
            Object.entries(groupedChallenges).map(([category, challengesInCategory]) => (
              <section key={category}>
                <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-brand-500 pb-3 mb-6">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {challengesInCategory.map(challenge => {
                    const isSolved = userProfile?.solvedChallenges?.includes(challenge.id);
                    const cardClasses = isSolved 
                      ? 'bg-green-50 border-green-200 shadow-sm' 
                      : 'bg-white hover:shadow-lg hover:-translate-y-1';

                    return (
                      <Link href={`/challenge/${challenge.id}`} key={challenge.id}>
                        <div className={`group relative rounded-2xl border transition-all duration-300 p-6 flex flex-col min-h-[180px] cursor-pointer ${cardClasses}`}>
                          {isSolved && (
                            <span className="absolute top-3 right-3 text-xs font-bold bg-green-200 text-green-800 px-2 py-1 rounded-full">Résolu</span>
                          )}
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-slate-900">{challenge.title}</h3>
                            <p className="mt-1 text-sm text-slate-500">Difficulté : <span className="capitalize font-medium">{challenge.difficulty}</span></p>
                          </div>
                          <div className="flex justify-between items-end mt-4">
                            <div className="text-brand-600 font-bold text-xl">
                              {challenge.points} pts
                            </div>
                            {!isSolved && 
                              <div className="bg-brand-500 text-white text-sm font-semibold px-4 py-2 rounded-lg group-hover:bg-brand-600 transition-colors">
                                Commencer
                              </div>
                            }
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
