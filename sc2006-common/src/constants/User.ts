import { Timestamp } from 'firebase/firestore';
import { DbNotification } from '.';

export interface User {
	username: string;
	eventIds: string[];
	schedule: DateTime[];
	notificationIds: string[];
	address: number | null;
	friendIds: string[];
}

export interface SeedUser {
	username: string;
	eventIds: string[];
	schedule: DateTime[];
	notifications: Pick<DbNotification, 'title' | 'description'>[];
	address: number | null;
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
