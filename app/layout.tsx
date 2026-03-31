import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CTF ESATIC',
  description: 'Plateforme CTF avec Next.js, Firebase et Tailwind CSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
