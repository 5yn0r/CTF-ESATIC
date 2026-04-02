import admin from 'firebase-admin';

// Correction : Les propriétés doivent être en snake_case pour correspondre à ce que le SDK Firebase attend.
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const areCredentialsPresent = serviceAccount.project_id && serviceAccount.client_email && serviceAccount.private_key;

let db: admin.firestore.Firestore | undefined;
let auth: admin.auth.Auth | undefined;

function initializeAdminApp() {
  if (admin.apps.length === 0) {
    if (!areCredentialsPresent) {
      console.error('Les informations d\'identification Firebase Admin (projet, email, clé) ne sont pas toutes définies dans les variables d\'environnement.');
      return; // Ne pas essayer d'initialiser si les variables manquent.
    }
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
      });
      console.log("Firebase Admin SDK initialisé avec succès.");
    } catch (error: any) {
      console.error('Erreur d\'initialisation de Firebase Admin:', error.message);
      // Cette erreur se produit souvent si les noms de propriétés (project_id) sont incorrects ou si la clé privée est mal formée.
      throw new Error('Impossible d\'initialiser le SDK Firebase Admin. Vérifiez les logs du serveur pour les détails.');
    }
  }
  db = admin.firestore();
  auth = admin.auth();
}

// Initialise l'app au chargement du module pour que db et auth soient prêts.
initializeAdminApp();

export function getAdminDb() {
  if (!db) {
    // Si l'initialisation a échoué, cette erreur sera levée à chaque appel.
    throw new Error('Le SDK Firebase Admin n\'est pas initialisé. Vérifiez les logs du serveur au démarrage.');
  }
  return db!;
}

export function getAdminAuth() {
  if (!auth) {
    throw new Error('Le SDK Firebase Admin n\'est pas initialisé. Vérifiez les logs du serveur au démarrage.');
  }
  return auth!;
}
