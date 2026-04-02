import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// Log pour le débogage : Afficher les variables d'environnement brutes
console.log('[Firebase Admin Init] Reading environment variables...');
console.log(`[Firebase Admin Init] FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? 'Exists' : 'MISSING'}`);
console.log(`[Firebase Admin Init] FIREBASE_CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL ? 'Exists' : 'MISSING'}`);
console.log(`[Firebase Admin Init] FIREBASE_PRIVATE_KEY: ${process.env.FIREBASE_PRIVATE_KEY ? 'Exists and has length ' + process.env.FIREBASE_PRIVATE_KEY.length : 'MISSING'}`);

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const projectId = process.env.FIREBASE_PROJECT_ID;

if (!admin.apps.length) {
  if (!clientEmail || !privateKey || !projectId) {
    // Log d'erreur plus détaillé
    console.error('[Firebase Admin Init] CRITICAL: One or more required environment variables are missing.');
    throw new Error('Les variables d\'environnement Firebase Admin ne sont pas toutes configurées.');
  }

  // Log juste avant l'initialisation
  console.log('[Firebase Admin Init] Initializing app with provided credentials...');
  
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: projectId,
        client_email: clientEmail,
        private_key: privateKey,
      } as ServiceAccount),
    });
    console.log('[Firebase Admin Init] Firebase Admin SDK initialized successfully!');
  } catch (e: any) {
    // Log de l'erreur d'initialisation elle-même
    console.error('[Firebase Admin Init] FAILED to initialize Firebase Admin SDK:', e);
    throw e; // Renvoyer l'erreur pour faire échouer la fonction
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
