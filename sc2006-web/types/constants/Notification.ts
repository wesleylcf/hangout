import { Timestamp } from 'firebase/firestore';

export interface Notification {
	uuid: string;
	createdAt: Timestamp;
	title: string;
	description: string;
	seenAt: Timestamp | null;
}
