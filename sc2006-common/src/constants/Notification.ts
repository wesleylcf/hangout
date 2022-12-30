import { Timestamp } from '@firebase/firestore-types';

export interface DbNotification {
	createdAt: Timestamp;
	title: string;
	description: string;
	seenAt: Timestamp | null;
}

export interface DbNotificationRes
	extends Omit<DbNotification, 'seenAt' | 'createdAt'> {
	createdAt: Date;
	uuid: string;
	seenAt: Date | null;
}
