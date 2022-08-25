import { Timestamp } from 'firebase/firestore';
import { DbUser } from '../../../../sc2006-common/src';

export interface ValidateUserOutcome {
	user?: Omit<DbUser, 'password'>;
	error?: string;
}

export interface TokenInput {
	username: string;
	createdAt: Timestamp;
}

export interface GetUserFromTokenReq {
	username?: string;
}
