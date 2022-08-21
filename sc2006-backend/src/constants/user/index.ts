import { Timestamp } from 'firebase/firestore';
import { Notification } from '../notification';

export interface DbUser {
  password: string;
  createdAt: Timestamp;
  eventIds: string[];
  schedule: DateTime[];
  notifications: Notification[];
  address: string | null;
  friendIds: string[];
}

export interface DateTime {
  date: Date;
  timeRanges: TimeRange[];
}

type TimeRange = [start: string, end: string];
