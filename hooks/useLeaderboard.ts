'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LeaderboardUser {
  id: string;
  displayName: string;
  score: number;
  solvedCount: number;
}

export function useLeaderboard(count: number = 20) {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('score', 'desc'), limit(count));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leaderboardUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName,
        score: doc.data().score,
        solvedCount: doc.data().solvedCount,
      }));
      setUsers(leaderboardUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [count]);

  return { users, loading };
}
