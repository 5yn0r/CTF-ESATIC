# CTF-ESATIC

## Objectif

Plateforme CTF moderne pour ESATIC avec:

- Next.js App Router + TypeScript
- Tailwind CSS
- Firebase Authentication + Firestore
- Vercel + Firebase backend

## Architecture

- `app/` : routes et pages de l’application
- `components/` : composants UI réutilisables
- `hooks/` : hooks personnalisés pour auth et profil
- `lib/` : configuration Firebase et logique partagée
- `app/api/` : API route Next.js pour vérifier les flags

## Fonctionnalités incluses

- Inscription / connexion email-password
- Auth Google
- Dashboard utilisateur
- Scoreboard live
- Profil utilisateur
- Page challenge avec soumission de flag
- Interface admin basique
- Firestore rules sécurisées

## Schéma Firestore recommandé

Collections principales :

- `users/{uid}`
  - `email`, `displayName`, `role`, `score`, `solvedCount`, `solvedChallenges`, `createdAt`
- `ctfs/{ctfId}`
  - `title`, `description`, `startAt`, `endAt`, `active`, `createdAt`
- `challenges/{challengeId}`
  - `ctfId`, `title`, `description`, `category`, `points`, `visible`, `flagHash`, `externalUrl`, `fileUrl`, `hints`, `createdAt`
- `submissions/{submissionId}`
  - `userId`, `ctfId`, `challengeId`, `text`, `status`, `createdAt`
- `solves/{solveId}`
  - `userId`, `challengeId`, `ctfId`, `solvedAt`

## Sécurité Firebase

- Règles strictes dans `firebase.rules`
- Authentification sur la route d’API `app/api/submit-flag/route.ts`
- Flags stockés en hash SHA-256 côté backend
- Accès admin protégé via le rôle stocké en Firestore (`users/{uid}.role`)
- Les variables `FIREBASE_ADMIN_*` sont des identifiants de service account, pas l’email du compte admin enregistré dans Firestore

## Installation

1. Copier `.env.local.example` en `.env.local`
2. Remplir les variables Firebase
3. Installer les dépendances :

```bash
npm install
```

4. Démarrer le serveur local :

```bash
npm run dev
```

## Déploiement

### Frontend

- Héberger sur Vercel
- Configurer les variables d’environnement dans le dashboard Vercel

### Firebase

- Créer un projet Firebase
- Activer Authentication (Email/Password et Google)
- Activer Firestore
- Importer `firebase.rules`
- Ajouter les variables admin dans Vercel / Firebase

## Améliorations possibles

- Ajout d’un mode équipe
- Score dynamique selon le nombre de solveurs
- Pagination et lazy loading
- Monitoring des abus dans un tableau admin
- Notifications en temps réel via Firebase Cloud Messaging
