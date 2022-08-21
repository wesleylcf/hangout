import { User } from '../constants';

export interface SignUpRes {
	error?: string;
}

export interface LoginRes {
	user?: User;
	error?: string;
}

export interface AuthUserReq {
	username: string;
	password: string;
}
