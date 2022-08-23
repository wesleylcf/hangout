import Iron from '@hapi/iron';
import { MAX_AGE, setTokenCookie, getTokenCookie } from './auth-cookies';
import { Request, Response } from 'express';
import { Session } from 'express-session';

const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET;

export async function setLoginSession(
	res: Response,
	session: { [key: string]: any },
) {
	const createdAt = Date.now();
	// Create a session object with a max age that we can validate later
	const obj = { ...session, createdAt, maxAge: MAX_AGE };
	const token = await Iron.seal(obj, AUTH_TOKEN_SECRET!, Iron.defaults);

	setTokenCookie(res, token);
}

export async function getLoginSession(req: Request) {
	const token = getTokenCookie(req);

	if (!token) return;

	const session = await Iron.unseal(token, AUTH_TOKEN_SECRET!, Iron.defaults);
	const expiresAt = session.createdAt + session.maxAge * 1000;

	// Validate the expiration date of the session
	if (Date.now() > expiresAt) {
		throw new Error('Session expired');
	}

	return session;
}
