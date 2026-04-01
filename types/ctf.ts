import { Timestamp } from 'firebase/firestore';

export type Ctf = {
  id: string;
  title: string;
  description: string;
  active: boolean;
  startAt: Timestamp;
  endAt: Timestamp;
};
