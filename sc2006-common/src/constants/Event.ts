import { Timestamp } from 'firebase/firestore';
import { DbEventResultRes } from './EventResult';
import { DbUserRes } from './User';

export interface DbEvent {
	name: string;
	authParticipantIds: string[];
	manualParticipants: PublicEventParticipant[];
	creatorId: string;
	createdAt: Timestamp;
	eventResultId: string;
	expiresAt: string;
}

export interface DbEventRes extends Omit<DbEvent, 'createdAt'> {
	uuid: string;
	createdAt: string;
}

export type DetailedEventRes = Omit<
	DbEventRes,
	'authParticipantIds' | 'eventResultId'
> & {
	eventResult: DbEventResultRes;
	authParticipants: DbUserRes[];
};

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
	schedule: Record<string, Array<{ start: string; end: string }>>;
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
