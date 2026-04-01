'use client';

import { useState } from 'react';

// Placeholder data - we will replace this with data from Firestore
const sampleCtfs = [
  { id: '1', name: 'ESATIC CTF 2024', status: 'active', startDate: '2024-07-20', endDate: '2024-07-21' },
  { id: '2', name: 'Intro to Web Security', status: 'upcoming', startDate: '2024-08-01', endDate: '2024-08-02' },
  { id: '3', name: 'Forensics Challenge', status: 'ended', startDate: '2024-06-15', endDate: '2024-06-16' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'active':
            return <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Actif</span>;
        case 'upcoming':
            return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">À venir</span>;
        case 'ended':
            return <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">Terminé</span>;
        default:
            return null;
    }
}

export default function CtfManager() {
  // We'll use this state to manage the list of CTFs
  const [ctfs, setCtfs] = useState(sampleCtfs);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Gestion des CTF</h2>
        <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
          Créer un CTF
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Nom</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Statut</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date de début</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date de fin</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {ctfs.map((ctf) => (
              <tr key={ctf.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{ctf.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{getStatusBadge(ctf.status)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{ctf.startDate}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{ctf.endDate}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <a href="#" className="text-brand-600 hover:text-brand-900">Modifier</a>
                  <a href="#" className="ml-4 text-red-600 hover:text-red-900">Supprimer</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
