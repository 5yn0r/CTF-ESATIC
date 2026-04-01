'use client';

import { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ScoreItem = {
  id: string;
  displayName: string;
  score: number;
  solvedChallenges: string[];
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

export default function ScoreboardPage() {
  const [leaders, setLeaders] = useState<ScoreItem[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [topLeaders, setTopLeaders] = useState<ScoreItem[]>([]);
  
  const trackedLeadersRef = useRef<ScoreItem[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('score', 'desc'), limit(20));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const currentLeaders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ScoreItem));
      setLeaders(currentLeaders);

      if (trackedLeadersRef.current.length === 0 && currentLeaders.length > 0) {
        const newTopLeaders = currentLeaders.slice(0, 5);
        trackedLeadersRef.current = newTopLeaders;
        setTopLeaders(newTopLeaders);
      }

      if (trackedLeadersRef.current.length > 0) {
        const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const newScores: { [key: string]: number | null } = {};
        trackedLeadersRef.current.forEach(leader => {
          const currentData = currentLeaders.find(l => l.id === leader.id);
          newScores[leader.displayName] = currentData ? currentData.score : null;
        });

        setChartData(prevData => {
          const lastEntry = prevData.length > 0 ? prevData[prevData.length - 1] : null;

          if (lastEntry && lastEntry.time === currentTime) {
            // Fusionner les nouveaux scores dans le dernier point de données existant
            const updatedLastEntry = { ...lastEntry, ...newScores };
            const newData = [...prevData];
            newData[newData.length - 1] = updatedLastEntry;
            return newData;
          } else {
            // Ajouter un nouveau point de données pour la nouvelle seconde
            const newEntry = { time: currentTime, ...newScores };
            return [...prevData, newEntry].slice(-30);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="main-shell py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-semibold text-slate-900">Classement en temps réel</h1>
          <p className="mt-3 text-slate-600">Suivez les meilleurs scores et la progression des joueurs.</p>

          <div className="mt-12">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Progression des Scores (Top 5)</h2>
            {chartData.length > 0 ? (
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '1rem'
                      }}
                    />
                    <Legend />
                    {topLeaders.map((leader, index) => (
                      <Line 
                        key={leader.id} 
                        type="monotone" 
                        dataKey={leader.displayName} 
                        stroke={COLORS[index % COLORS.length]} 
                        strokeWidth={2}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
                <p className="text-slate-500">En attente de données pour afficher la progression...</p>
              </div>
            )}
          </div>

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200">
            <div className="bg-slate-100 px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Top 20</div>
            <div className="divide-y divide-slate-200 bg-white">
              {leaders.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">{index + 1}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{user.displayName}</p>
                      <p className="text-sm text-slate-500">{user.solvedChallenges?.length ?? 0} défis résolus</p>
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
