import { DbUserRes } from '../constants';
import { PresentableError } from '../../lib/error';

export interface GetUserRes {
	error: Omit<PresentableError, 'name'> | null;
	user: DbUserRes | null;
}
