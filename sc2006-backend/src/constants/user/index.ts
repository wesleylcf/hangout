import { Timestamp } from 'firebase/firestore';
import { Notification } from '../notification';

export interface DbUser {
  password: string;
  createdAt: Timestamp;
  eventIds: [];
  schedule: [];
  notifications: Notification[];
  address: string | null;
}

export interface DateTime {
  date: Date;
  timeRanges: TimeRange[];
}

type TimeRange = [start: string, end: string];
