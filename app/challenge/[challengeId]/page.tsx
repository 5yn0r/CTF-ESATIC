'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/Navbar';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import Confetti from 'react-confetti';

type Challenge = {
  id: string;
  ctfId: string; // Ajouté pour le bouton de retour
  title: string;
  description: string;
  category: string;
  points: number;
  difficulty: string;
  externalLink?: string;
};

export default function ChallengePage() {
  const params = useParams();
  const challengeId = params.challengeId as string;
  const { user } = useAuth();
  const { profile: userProfile, loading: profileLoading } = useUserProfile(user?.uid);

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(true);
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [showSuccessUI, setShowSuccessUI] = useState(false);

  // Le challenge est considéré comme résolu si l'ID est dans le profil OU si on vient de le réussir
  const isSolved = userProfile?.solvedChallenges?.includes(challengeId) || showSuccessUI;

  useEffect(() => {
    if (!challengeId) return;

    const fetchChallenge = async () => {
      const challengeDocRef = doc(db, 'challenges', challengeId);
      const challengeDocSnap = await getDoc(challengeDocRef);

      if (challengeDocSnap.exists()) {
        setChallenge({ id: challengeDocSnap.id, ...challengeDocSnap.data() } as Challenge);
      } else {
        // Gérer challenge non trouvé
      }
      setChallengeLoading(false);
    };

    fetchChallenge();
  }, [challengeId]);

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setMessage('Vous devez être connecté pour soumettre un flag.');
        setMessageType('error');
        return;
    }
    
    setMessage('Vérification en cours...');
    setMessageType('info');

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/submit-flag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ challengeId, flag }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message);
        setMessageType('success');
        setShowSuccessUI(true); // Déclencher l'UI de succès !
      } else {
        setMessage(data.message || data.error || 'Une erreur est survenue.');
        setMessageType('error');
      }
    } catch (error) {
        console.error('Erreur de communication avec l\'API', error);
        setMessage('Impossible de contacter le serveur. Veuillez réessayer.');
        setMessageType('error');
    }
  };
  
  const messageColor = {
    error: 'text-red-600',
    success: 'text-green-600',
    info: 'text-slate-600'
  }[messageType];

  if (challengeLoading || profileLoading) {
    return <div><Navbar /><main className="main-shell py-12"><p>Chargement du challenge...</p></main></div>;
  }

  if (!challenge) {
    return <div><Navbar /><main className="main-shell py-12"><p>Challenge non trouvé.</p></main></div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {isSolved && <Confetti recycle={false} />}
      <Navbar />
      <main className="main-shell py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-soft border border-slate-200 p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className='flex-grow'>
                    <h1 className="text-3xl font-bold text-slate-900">{challenge.title}</h1>
                    <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                        <span>{challenge.category}</span>
                        <span className="font-bold text-brand-600">{challenge.points} pts</span>
                        <span className="capitalize">Difficulté: {challenge.difficulty}</span>
                    </div>
                </div>
                {challenge.externalLink && (
                    <a href={challenge.externalLink} target="_blank" rel="noopener noreferrer" className="mt-4 md:mt-0 md:ml-6 flex-shrink-0 rounded-full bg-blue-500 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-600 transition-colors">
                        Lien du challenge
                    </a>
                )}
            </div>

            <div className="prose prose-slate max-w-none mt-8 border-t border-slate-200 pt-6">
              <ReactMarkdown>{challenge.description}</ReactMarkdown>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold text-slate-800">Soumettre le Flag</h2>
              {isSolved ? (
                <div className="mt-4 p-4 rounded-2xl bg-green-100 border border-green-300 text-center">
                    <p className="font-semibold text-green-800">🎉 Bravo ! Vous avez validé ce challenge.</p>
                    {challenge.ctfId && (
                      <Link href={`/ctf/${challenge.ctfId}`} className="inline-block mt-4 bg-brand-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-600 transition-colors no-underline">
                          Retour aux challenges
                      </Link>
                    )}
                </div>
              ) : (
                <form onSubmit={handleFlagSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="CTF{....}"
                    className="flex-grow rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:ring-brand-500 focus:border-brand-500"
                    disabled={!user}
                  />
                  <button 
                    type="submit"
                    className="rounded-full bg-brand-500 text-white px-8 py-3 font-semibold hover:bg-brand-700 transition-colors disabled:bg-slate-400"
                    disabled={!user || challengeLoading}
                  >
                    Valider
                  </button>
                </form>
              )}
              {message && !isSolved && <p className={`mt-4 text-sm font-medium ${messageColor}`}>{message}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
