import { Timestamp } from 'firebase/firestore';

export interface DbEvent {
	title: string;
	activeParticipantIds: string[];
	invitedParticipantIds: string[];
	creatorId: string;
	createdAt: Timestamp;
	eventResultIds: string[];
	expired: boolean;
}

export interface DbEventRes extends Omit<DbEvent, 'createdAt'> {
	uuid: string;
	createdAt: Date;
}

export interface CreateEventReq {
	title: string;
	userIds: string[];
	publicUsers: [];
}
