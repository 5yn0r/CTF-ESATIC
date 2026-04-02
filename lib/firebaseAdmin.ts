import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// CORRECTION 1: Utiliser les noms de variables d'environnement corrects (sans _ADMIN_)
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const projectId = process.env.FIREBASE_PROJECT_ID;

if (!admin.apps.length) {
  if (!clientEmail || !privateKey || !projectId) {
    throw new Error('Les variables d\'environnement Firebase Admin (FIREBASE_CLIENT_EMAIL, etc.) ne sont pas toutes configurées.');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      // CORRECTION 2: Utiliser les clés en snake_case pour l'objet credential
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    } as ServiceAccount),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
