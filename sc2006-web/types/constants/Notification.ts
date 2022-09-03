import { Timestamp } from 'firebase/firestore';

export interface DbNotification {
	uuid: string;
	createdAt: Timestamp;
	title: string;
	description: string;
	seenAt: Timestamp | null;
}

export interface NotificationRes {
	uuid: string;
	title: string;
	description: string;
	createdAt: Date;
	seenAt: Date | null;
}
