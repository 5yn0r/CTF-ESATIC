'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Définition de type locale simplifiée pour la clarté
type Challenge = {
  id: string;
  title: string;
  description: string;
  points: number;
};

interface SolvedChallengesProps {
  solvedChallengeIds: string[]; // On attend maintenant un tableau d'IDs (string)
}

export default function SolvedChallenges({ solvedChallengeIds }: SolvedChallengesProps) {
  const [solvedChallenges, setSolvedChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!solvedChallengeIds || solvedChallengeIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchSolvedChallenges = async () => {
      setLoading(true);
      try {
        const challenges = await Promise.all(
          // 1. On itère sur les IDs
          solvedChallengeIds.map(async (id) => {
            // 2. On crée la référence de document complète
            const ref = doc(db, 'challenges', id);
            // 3. On fetch le document avec la référence correcte
            const challengeDoc = await getDoc(ref);
            return challengeDoc.exists() ? ({ id: challengeDoc.id, ...challengeDoc.data() } as Challenge) : null;
          })
        );
        setSolvedChallenges(challenges.filter((c) => c !== null) as Challenge[]);
      } catch (error) {
        console.error("Erreur lors de la récupération des challenges résolus:", error);
      }
      setLoading(false);
    };

    fetchSolvedChallenges();
  }, [solvedChallengeIds]);

  if (loading) {
    return <p className="text-center text-slate-500">Chargement des challenges résolus...</p>;
  }

  if (solvedChallenges.length === 0) {
    return <p className="text-center text-slate-500">Aucun challenge résolu pour le moment.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Challenges Résolus</h2>
      <ul className="space-y-4">
        {solvedChallenges.map((challenge) => (
          <li key={challenge.id} className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-900">{challenge.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{challenge.description}</p>
            <p className="mt-3 font-bold text-green-600">+{challenge.points} points</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
