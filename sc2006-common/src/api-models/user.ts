import { DbUserRes } from '../constants';
import { PresentableError } from '../utils';

export interface GetUserRes {
	error: Omit<PresentableError, 'name'> | null;
	user: DbUserRes | null;
}
