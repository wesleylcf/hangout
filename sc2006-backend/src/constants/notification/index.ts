import { Timestamp } from 'firebase/firestore';

export interface Notification {
  createdAt: Timestamp;
  message: string;
  isNew: boolean;
}
