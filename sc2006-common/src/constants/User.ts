import { Timestamp } from '@firebase/firestore-types';
import { DbNotification } from '.';

export interface SeedUser {
	username: string;
	eventIds: string[];
	schedule: Record<string, Array<TimeRange>>;
	preferences: string[];
	notifications: Pick<DbNotification, 'title' | 'description'>[];
	address: string | null;
	friendIds: string[];
}

export interface DbUser {
	createdAt: Timestamp;
	eventIds: string[];
	friendIds: string[];
	schedule: Schedule;
	preferences: string[];
	notificationIds: string[];
	address: string | null;
	password: string;
	updatedAt: string;
}

export interface DbUserRes extends Omit<DbUser, 'createdAt'> {
	createdAt: Date;
}

export interface UserRes extends Omit<DbUser, 'createdAt' | 'password'> {
	createdAt: Date;
	uuid: string;
}

export type Schedule = Record<string, Array<TimeRange>>;

export interface TimeRange {
	start: string;
	end: string;
}
