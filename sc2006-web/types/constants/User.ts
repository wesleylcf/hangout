import { Timestamp } from 'firebase/firestore';
import { DbNotification } from '.';

export interface SeedUser {
	username: string;
	eventIds: string[];
	schedule: DateTime[];
	notifications: Pick<DbNotification, 'title' | 'description'>[];
	address: number | null;
	friendIds: string[];
}

export interface DbUser {
	createdAt: Timestamp;
	eventIds: string[];
	friendIds: string[];
	schedule: DateTime[];
	notificationIds: string[];
	address: number | null;
	password: string;
}

export interface DbUserRes extends Omit<DbUser, 'createdAt'> {
	createdAt: Date;
}

export interface UserRes extends Omit<DbUser, 'createdAt' | 'password'> {
	createdAt: Date;
	uuid: string;
}

export interface DateTime {
	date: Date;
	timeRanges: TimeRange[];
}

type TimeRange = [start: Date, end: Date];

export interface PublicUser {
	schedule: DateTime;
	address: string;
	preferences: string[];
}
