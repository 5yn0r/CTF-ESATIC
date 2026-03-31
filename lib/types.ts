export type UserRole = 'user' | 'admin' | 'banned';

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  score: number;
  solvedCount: number;
  solvedChallenges: string[];
  createdAt: string;
};

export type CtfEvent = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  active: boolean;
  createdAt: string;
};

export type ChallengeCategory = 'Web' | 'Crypto' | 'Pwn' | 'Reverse' | 'Forensics' | 'OSINT';

export type Challenge = {
  id: string;
  ctfId: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  points: number;
  externalUrl?: string;
  fileUrl?: string;
  hints?: Array<{ id: string; text: string; cost: number }>;
  createdAt: string;
  visible: boolean;
};

export type Submission = {
  id: string;
  userId: string;
  ctfId: string;
  challengeId: string;
  status: 'correct' | 'incorrect';
  text: string;
  createdAt: string;
};
