import axios from 'axios';
import {
	SignUpRes,
	LoginRes,
	AuthUserReq,
} from '../../sc2006-common/src/api-models';

interface Response<T> {
	data: T;
}

export class MeService {
	async signup(user: AuthUserReq) {
		const { data } = await axios.post<Response<SignUpRes>>(
			`${process.env.API_URL}/auth/signup`,
			user,
		);
		return data;
	}

	async login(req: AuthUserReq) {
		const { data } = await axios.post<Response<LoginRes>>(
			`http://localhost:3100/auth/login`,
			req,
		);
		const { user, access_token, error } = data.data;
		if (error) {
			throw new Error(error);
		}
		// TODO set acccess_token to session
		return user!;
	}
}
