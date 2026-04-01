import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function HomePage() {
  return (
    <div 
      style={{
        backgroundImage: 'url(/ctf.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      <Navbar />
      <main className="main-shell flex items-center justify-center py-16" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Ajout d'un conteneur avec fond semi-transparent pour la lisibilité */}
        <section className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-lg border border-slate-200">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">
              Plateforme CTF du Club Informatique de l'ESATIC
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              Prêt à relever le défi ?
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
              Mettez vos compétences en cybersécurité à l'épreuve. Résolvez des challenges, capturez les drapeaux (flags) et mesurez-vous aux autres étudiants.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="rounded-full bg-brand-500 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-brand-700">
                Commencer à jouer
              </Link>
              <Link href="/dashboard" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-lg font-semibold text-slate-700 hover:bg-slate-50">
                Accéder au Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
