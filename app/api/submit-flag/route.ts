import { getAdminDb, getAdminAuth } from '@/lib/firebaseAdmin';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

const verifyFlag = (submittedFlag: string, correctFlag: string) => {
    return submittedFlag.trim() === correctFlag.trim();
};

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const decodedToken = await getAdminAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { challengeId, flag } = await req.json();

    if (!challengeId || !flag) {
      return NextResponse.json({ error: 'Challenge ID et flag sont requis' }, { status: 400 });
    }

    const userRef = getAdminDb().collection('users').doc(userId);

    const result = await getAdminDb().runTransaction(async (transaction: admin.firestore.Transaction) => {
      const challengeRef = getAdminDb().collection('challenges').doc(challengeId);
      const challengeDoc = await transaction.get(challengeRef);
      const userDoc = await transaction.get(userRef);

      if (!challengeDoc.exists) { throw new Error('Challenge non trouvé'); }
      if (!userDoc.exists) { throw new Error('Utilisateur non trouvé'); }

      const challengeData = challengeDoc.data()!;
      const userData = userDoc.data()!;

      const solvedChallenges = userData.solvedChallenges || [];
      if (solvedChallenges.includes(challengeId)) {
        return { success: false, message: 'Challenge déjà résolu !' };
      }

      if (verifyFlag(flag, challengeData.flag)) {
        const newScore = (userData.score || 0) + challengeData.points;
        transaction.update(userRef, {
          score: newScore,
          solvedChallenges: FieldValue.arrayUnion(challengeId),
        });
        return { success: true, message: 'Félicitations ! Flag correct.', points: challengeData.points };
      } else {
        return { success: false, message: 'Flag incorrect. Essayez encore !' };
      }
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error(`[API SUBMIT-FLAG ERROR] User: ${req.headers.get('Authorization')?.substring(0, 15)}... | Challenge: ${req.body ? JSON.parse(JSON.stringify(req.body)).challengeId : 'N/A'} | Error: ${error.message}`)

    if (error.message.includes('non trouvé')) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Une erreur inattendue est survenue sur le serveur.' }, { status: 500 });
  }
}
