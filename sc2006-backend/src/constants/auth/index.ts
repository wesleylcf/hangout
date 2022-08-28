import { Timestamp } from 'firebase/firestore';
import { DbUser, PresentableError } from '../../../../sc2006-common/src';

export interface ValidateUserOutcome {
	user?: Omit<DbUser, 'password'>;
	error?: PresentableError;
}

export interface TokenInput {
	username: string;
	createdAt: Timestamp;
}

export interface GetUserFromTokenReq {
	username?: string;
}
