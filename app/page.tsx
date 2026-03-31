import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="main-shell py-16">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">
              Plateforme CTF étudiante
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Construisez, jouez et gérez votre CTF avec Firebase et Next.js
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Authentification, challenges, soumission de flags, scoreboard en temps réel et tableau d’administration sécurisé.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
                Rejoindre le club
              </Link>
              <Link href="/dashboard" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Voir le dashboard
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Fonctionnalités clés</h2>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li>Authentification email/password + Google</li>
              <li>Challenges multi-catégories</li>
              <li>Soumission de flags avec vérification serveur</li>
              <li>Scoreboard en temps réel</li>
              <li>Interface admin pour gérer CTF et utilisateurs</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
