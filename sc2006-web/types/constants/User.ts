import { Timestamp } from 'firebase/firestore';
import { Notification } from '.';

type TimeRange = [start: string, end: string];
export interface DateTime {
	date: Date;
	timeRanges: TimeRange[];
}

export interface User {
	username: string;
	eventIds: string[];
	schedule: DateTime[];
	notifications: Notification[];
	address: number | null;
	friendIds: string[];
}

export interface DbUser extends User {
	password: string;
	createdAt: Timestamp;
}
