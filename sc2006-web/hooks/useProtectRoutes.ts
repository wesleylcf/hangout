import { useEffect, useContext } from 'react';
import useSWR from 'swr';
import { meService } from '../services';
import { useRouter } from 'next/router';
import { GlobalContext } from '../contexts/GlobalContext';
import { useRoutes, Routes } from '.';

interface ProtectRouteResult {
	finished: boolean;
}

export function useProtectRoutes(
	redirectToIfUnauthenticated = '/login',
	redirectToIfAuthenticated = '/',
): ProtectRouteResult {
	const router = useRouter();
	const { me, setMe } = useContext(GlobalContext);
	const username = me?.username;
	const { allowedRoutes } = useRoutes();
	const fetcher = async () => await meService.revalidate(username);
	const { data, error } = useSWR('/revalidate', fetcher) as any;

	const status = data?.status;
	const user = data?.user;
	const finished = Boolean(data);
	const authenticated = status < 205;

	useEffect(() => {
		if (!finished || me || allowedRoutes[router.asPath as Routes]) return;

		if (authenticated) {
			if (!me && user) {
				setMe(user);
				return;
			}
			if (!allowedRoutes[router.asPath as Routes]) {
				router.push(redirectToIfAuthenticated);
			}
		} else {
			if (!allowedRoutes[router.asPath as Routes]) {
				router.push(redirectToIfUnauthenticated);
			}
			if (me) {
				setMe(undefined as any);
			}
		}
	}, [
		redirectToIfUnauthenticated,
		redirectToIfAuthenticated,
		finished,
		authenticated,
		me,
		allowedRoutes,
		user,
		router.asPath,
	]);

	return { finished };
}
