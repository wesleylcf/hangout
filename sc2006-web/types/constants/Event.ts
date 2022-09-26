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

export interface PublicEventParticipant {
	name: string;
	preferences: Array<string>;
	schedule: any;
	address: string;
	isCreator: boolean;
}

interface AuthEventParticipant {
	uuid: string;
	isCreator: boolean;
}

export type EventParticipant = PublicEventParticipant | AuthEventParticipant;
