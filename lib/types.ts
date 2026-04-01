import { Timestamp } from 'firebase/firestore';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  author: string;
  ctfId: string;
  fileUrl?: string;
  externalUrl?: string;
  createdAt: Timestamp;
  hints: { id: string; text: string; cost: number }[];
}
