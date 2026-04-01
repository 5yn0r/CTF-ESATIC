'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Définition du type pour le profil utilisateur
export interface UserProfile {
  role: 'user' | 'admin';
  score: number;
  solvedChallenges: string[];
  displayName: string;
  email: string;
  // ... et toute autre donnée que vous avez dans la collection 'users'
}

export function useUserProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      setProfile(null);
      return;
    }

    const userDocRef = doc(db, 'users', uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Erreur lors de la récupération du profil:", error);
        setProfile(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  return { profile, loading };
}
