import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();

export async function registerUser(email: string, password: string, displayName: string) {
  const credentials = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credentials.user, { displayName });
  await setDoc(doc(db, 'users', credentials.user.uid), {
    email,
    displayName,
    role: 'user',
    score: 0,
    solvedCount: 0,
    solvedChallenges: [],
    createdAt: serverTimestamp(),
  });
  return credentials.user;
}

export async function loginUser(email: string, password: string) {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return credentials.user;
}

export async function loginWithGoogle() {
  const credentials = await signInWithPopup(auth, googleProvider);
  const user = credentials.user;
  await setDoc(
    doc(db, 'users', user.uid),
    {
      email: user.email,
      displayName: user.displayName || 'Participant CTF',
      role: 'user',
      score: 0,
      solvedCount: 0,
      solvedChallenges: [],
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
  return user;
}

export async function logoutUser() {
  return signOut(auth);
}

export function mapFirebaseUser(user: User | null) {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? '',
  };
}
