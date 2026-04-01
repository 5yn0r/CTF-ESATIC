import admin from 'firebase-admin';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const areCredentialsPresent = serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey;

let db: admin.firestore.Firestore | undefined;
let auth: admin.auth.Auth | undefined;

function initializeAdminApp() {
  if (admin.apps.length === 0) {
    if (!areCredentialsPresent) {
      throw new Error('Les informations d\'identification de Firebase Admin ne sont pas définies dans les variables d\'environnement.');
    }
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
      });
    } catch (error: any) {
      console.error('Erreur d\'initialisation de Firebase Admin:', error.message);
      throw new Error('Impossible d\'initialiser le SDK Firebase Admin. Vérifiez les logs du serveur pour les détails.');
    }
  }
  db = admin.firestore();
  auth = admin.auth();
}

// Getters pour les services Admin. Initialise l'app si ce n'est pas déjà fait.
export function getAdminDb() {
  if (!db) {
    initializeAdminApp();
  }
  return db!;
}

export function getAdminAuth() {
  if (!auth) {
    initializeAdminApp();
  }
  return auth!;
}
