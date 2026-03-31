import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import crypto from 'crypto';

const MAX_INCORRECT_ATTEMPTS = 8;
const BRUTE_FORCE_WINDOW_MINUTES = 10;

function hashFlag(flag: string) {
  return crypto.createHash('sha256').update(flag.trim()).digest('hex');
}

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('authorization') || '';
  const idToken = authorization.replace('Bearer ', '');
  if (!idToken) {
    return NextResponse.json({ message: 'Authentification requise.' }, { status: 401 });
  }

  const body = await request.json();
  const { challengeId, ctfId, flag } = body;

  if (!challengeId || !ctfId || !flag) {
    return NextResponse.json({ message: 'Données manquantes.' }, { status: 400 });
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch (err) {
    return NextResponse.json({ message: 'Jeton invalide.' }, { status: 401 });
  }

  const userId = decoded.uid;
  const challengeRef = adminDb.collection('challenges').doc(challengeId);
  const challengeSnap = await challengeRef.get();

  if (!challengeSnap.exists) {
    return NextResponse.json({ message: 'Challenge introuvable.' }, { status: 404 });
  }

  const challengeData = challengeSnap.data();
  const recentSubmissions = await adminDb
    .collection('submissions')
    .where('userId', '==', userId)
    .where('status', '==', 'incorrect')
    .where('createdAt', '>=', new Date(Date.now() - BRUTE_FORCE_WINDOW_MINUTES * 60 * 1000))
    .get();

  if (recentSubmissions.size >= MAX_INCORRECT_ATTEMPTS) {
    return NextResponse.json({ message: 'Trop de tentatives. Réessayez dans quelques minutes.' }, { status: 429 });
  }

  const isCorrect = hashFlag(flag) === challengeData.flagHash;
  const submissionRef = adminDb.collection('submissions').doc();
  const createdAt = new Date();

  await submissionRef.set({
    userId,
    ctfId,
    challengeId,
    text: flag,
    status: isCorrect ? 'correct' : 'incorrect',
    createdAt,
  });

  if (!isCorrect) {
    return NextResponse.json({ message: 'Flag incorrect. Continuez à chercher !' }, { status: 400 });
  }

  const userRef = adminDb.collection('users').doc(userId);
  const solvedRef = adminDb.collection('solves').doc(`${userId}_${challengeId}`);

  await adminDb.runTransaction(async (transaction) => {
    const userSnap = await transaction.get(userRef);
    const solvedSnap = await transaction.get(solvedRef);
    if (solvedSnap.exists) {
      return;
    }

    const currentScore = userSnap.exists ? userSnap.data()?.score ?? 0 : 0;
    const currentSolvedCount = userSnap.exists ? userSnap.data()?.solvedCount ?? 0 : 0;

    transaction.set(solvedRef, {
      userId,
      challengeId,
      ctfId,
      solvedAt: createdAt,
    });
    transaction.update(userRef, {
      score: currentScore + (challengeData.points ?? 0),
      solvedCount: currentSolvedCount + 1,
    });
  });

  return NextResponse.json({ message: 'Flag correct ! Points attribués.' });
}
