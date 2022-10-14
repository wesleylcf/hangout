import { Timestamp } from 'firebase/firestore';
import { CreateEventReq } from '../api-models';
import { DbEventResultRes } from './EventResult';
import { DbUserRes } from './User';

export interface DbEvent extends CreateEventReq {
	creatorId: string;
	createdAt: Timestamp;
	eventResultId: string;
	expiresAt: string;
}

export interface DbEventRes extends Omit<DbEvent, 'createdAt'> {
	uuid: string;
	createdAt: string;
}

export type DetailedEventRes = Omit<DbEventRes, 'eventResultId'> & {
	eventResult: DbEventResultRes;
};

// export interface PublicEventParticipant {
// 	isCreator: boolean;
// 	name: string;
// 	preferences: Array<string>;
// 	schedule: Record<string, Array<{ start: string; end: string }>>;
// 	address: string;
// }

export type PublicEventParticipant = Pick<
	DbUserRes,
	'preferences' | 'schedule'
> & {
	address: string;
	isCreator: boolean;
	name: string;
};

export interface AuthEventParticipant extends PublicEventParticipant {
	uuid: string;
}

export type EventParticipant = PublicEventParticipant | AuthEventParticipant;
