import { Timestamp } from 'firebase/firestore';
import { Notification } from '.';

export interface User {
	username: string;
	eventIds: string[];
	schedule: DateTime[];
	notifications: Notification[];
	address: string | null;
	friendIds: string[];
}

export interface DbUser extends User {
	password: string;
	createdAt: Timestamp;
}

export interface DateTime {
	date: Date;
	timeRanges: TimeRange[];
}

type TimeRange = [start: string, end: string];
