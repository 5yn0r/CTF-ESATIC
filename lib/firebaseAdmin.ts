import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;

if (!admin.apps.length) {
  if (!clientEmail || !privateKey || !projectId) {
    throw new Error('Firebase Admin credentials are not fully configured.');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    } as ServiceAccount),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
