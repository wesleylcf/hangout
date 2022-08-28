import { useEffect, useContext } from 'react';
import useSWR from 'swr';
import { meService } from '../services';
import { useRouter } from 'next/router';
import { GlobalContext } from '../contexts/';
import { getRoutes, Routes } from '../lib/routes';

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
	const { allowedRoutes } = getRoutes(me);
	const fetcher = async () => await meService.revalidate(username);
	const { data, error } = useSWR('/revalidate', fetcher) as any;

	const status = data?.status;
	const user = data?.user;
	const finished = Boolean(data);
	const authenticated = status < 205;

	useEffect(() => {
		if (!finished) return;

		if (authenticated) {
			if (!me && user) {
				setMe(user);
			} else if (!allowedRoutes[router.asPath as Routes]) {
				router.push(redirectToIfAuthenticated);
			}
		} else if (!me) {
			if (!allowedRoutes[router.asPath as Routes]) {
				router.push(redirectToIfUnauthenticated);
			}
		}
	}, [finished, authenticated, me, allowedRoutes, user, router.asPath]);

	return { finished };
}
