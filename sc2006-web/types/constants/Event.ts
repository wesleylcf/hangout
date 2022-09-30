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

interface BaseEventParticipant {
	isCreator: boolean;
}

export interface PublicEventParticipant extends BaseEventParticipant {
	name: string;
	preferences: Array<string>;
	schedule: Record<string, Array<[string, string]>>;
	address: string;
	uuid?: never;
}

export interface AuthEventParticipant extends BaseEventParticipant {
	uuid: string;
	name?: never;
	preferences?: never;
	schedule?: never;
	address?: never;
}

export type EventParticipant = PublicEventParticipant | AuthEventParticipant;
