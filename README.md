# Plateforme CTF du Club Informatique de l'ESATIC

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Une plateforme web open-source conçue pour l'organisation de compétitions de type "Capture The Flag" (CTF). Mettez vos compétences en cybersécurité à l'épreuve, résolvez des challenges, capturez les drapeaux (flags) et mesurez-vous aux autres étudiants.

## Fonctionnalités

-   **Challenges & Catégories** : Créez et organisez des challenges par catégorie (Web, Crypto, Forensics, etc.), avec différents niveaux de difficulté.
-   **Classement en Temps Réel** : Suivez la progression et les scores des joueurs sur un tableau de bord dynamique.
-   **Profils Utilisateurs** : Chaque utilisateur dispose d'un profil public affichant son score, son rang et l'historique des challenges résolus.
-   **Soumission de Flags** : Un système simple pour soumettre les "flags" et valider les challenges.
-   **Authentification Sécurisée** : Gestion des comptes utilisateurs basée sur Firebase Authentication.

## Technologies Utilisées

-   **Framework Frontend** : [Next.js](https://nextjs.org/) (React)
-   **Base de Données & Backend** : [Firebase](https://firebase.google.com/) (Firestore, Firebase Auth)
-   **Styling** : [Tailwind CSS](https://tailwindcss.com/)
-   **Langage** : [TypeScript](https://www.typescriptlang.org/)
-   **Hébergement** : [Vercel](https://vercel.com/)

## Installation

Pour lancer le projet en local, suivez ces étapes :

1.  **Cloner le dépôt**
    ```bash
    git clone https://github.com/5yn0r/CTF-ESATIC.git
    cd CTF-ESATIC
    ```

2.  **Créer le fichier d'environnement**
    Créez un fichier `.env.local` à la racine du projet en vous basant sur `.env.local.example`.

3.  **Remplir les variables Firebase**
    Connectez-vous à votre console Firebase, créez un projet web et copiez les clés API dans le fichier `.env.local`.

4.  **Installer les dépendances**
    ```bash
    npm install
    ```

5.  **Démarrer le serveur local**
    ```bash
    npm run dev
    ```
    Le site est maintenant accessible sur `http://localhost:3000`.

## Déploiement

### Frontend
-   **Hébergement** : Le projet est optimisé pour un déploiement sur [Vercel](https://vercel.com/).
-   **Configuration** : N'oubliez pas de configurer les mêmes variables d’environnement que votre fichier `.env.local` directement dans le dashboard de votre projet Vercel.

### Firebase
-   **Règles de sécurité** : Assurez-vous que vos règles de sécurité Firestore sont correctement configurées pour la production afin de protéger les données de vos utilisateurs.
-   **Index** : Si vous modifiez les requêtes Firestore, Firebase pourrait vous demander de créer des index composites. Suivez les instructions fournies dans les logs d'erreur pour les créer.

## Licence

Ce projet est distribué sous la **Licence MIT**. Consultez le fichier `LICENSE` pour plus de détails, mais en résumé, vous êtes libre de l'utiliser, de le modifier et de le distribuer.

```text
MIT License

Copyright (c) 2026 KOUAME NORGIL OUSSOU

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Remerciements

-   Un grand merci à tous les contributeurs et membres du Club Informatique de l'ESATIC notamment ceux de la section CYBERSÉCURITÉ.


