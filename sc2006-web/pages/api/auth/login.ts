import {
	AuthUserReq,
	Response,
	LoginRes,
} from '../../../../sc2006-common/src/api-models';
import axios from 'axios';

export default async function (req: AuthUserReq) {
	const { data } = await axios.post<Response<LoginRes>>(
		`${process.env.API_URL}/auth/login`,
		req,
	);
	const { user, access_token, error } = data.data;
	if (error) {
		throw new Error(error);
	}

	// set token
	return user!;
}
