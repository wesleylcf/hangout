import axios from 'axios';
import {
	SignUpRes,
	LoginRes,
	AuthUserReq,
} from '../../sc2006-common/src/api-models';

export class MeService {
	async signup(user: AuthUserReq) {
		const { data } = await axios.post<SignUpRes>(
			`${process.env.API_URL}/auth/signup`,
			user,
		);
		return data;
	}

	async login(req: AuthUserReq) {
		const { data } = await axios.post<LoginRes>(
			`${process.env.API_URL}/auth/login`,
			req,
		);
		const { user, error } = data;
		if (error) {
			throw new Error(error);
		}
		return user!;
	}
}
