import { Timestamp } from 'firebase/firestore';
import { Moment } from 'moment';

export interface DbEvent {
	name: string;
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
	name: string;
	participants: EventParticipant[];
}

export interface PublicEventParticipant {
	name: string;
	preferences: Array<string>;
	schedule: Record<string, Array<[string, string]>>;
	address: string;
	isCreator: boolean;
}

interface AuthEventParticipant {
	uuid: string;
	isCreator: boolean;
}

export type EventParticipant = PublicEventParticipant | AuthEventParticipant;
