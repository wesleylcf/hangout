import { DbUser } from '../../../../sc2006-common/src';

export interface ValidateUserOutcome {
	user?: Omit<DbUser, 'password'>;
	error?: string;
}
