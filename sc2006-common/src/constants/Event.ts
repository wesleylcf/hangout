import { Timestamp } from 'firebase/firestore';

export interface DbEvent {
	title: string;
	activeParticipantIds: string[];
	inivitedParticipantIds: string[];
	creatorId: string;
	createdAt: Timestamp;
	eventResultIds: string[];
	expired: boolean;
}

export interface DbEventRes extends Omit<DbEvent, 'createdAt'> {
	uuid: string;
	createdAt: Date;
}
