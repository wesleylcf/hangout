import { Timestamp } from 'firebase/firestore';
import { DbNotification } from '.';
import { Moment } from 'moment';

export interface SeedUser {
	username: string;
	eventIds: string[];
	schedule: Record<string, Array<TimeRange>>;
	notifications: Pick<DbNotification, 'title' | 'description'>[];
	address: number | null;
	friendIds: string[];
}

export interface DbUser {
	createdAt: Timestamp;
	eventIds: string[];
	friendIds: string[];
	schedule: Record<string, Array<TimeRange>>;
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

type TimeRange = { start: string; end: string };

export interface PublicUser {
	schedule: Record<string, Array<TimeRange>>;
	address: string;
	preferences: string[];
}
