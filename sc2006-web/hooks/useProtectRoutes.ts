import { useEffect, useContext } from 'react';
import useSWR from 'swr';
import { meService } from '../services';
import { useRouter } from 'next/router';
import { GlobalContext } from '../contexts/';
import { getRoutes, Routes } from '../lib/routes';
import { useNotification } from './useNotification';

interface ProtectRouteResult {
	finished: boolean;
}

export function useProtectRoutes(
	redirectToIfUnauthenticated = '/login',
	redirectToIfAuthenticated = '/home',
) {
	const router = useRouter();
	const { me, wasLoggedIn, setWasLoggedIn } = useContext(GlobalContext);
	const notification = useNotification();
	// const username = me?.username;

	// const fetcher = async () => await meService.revalidate(username);
	// const { data, error } = useSWR('/revalidate', fetcher) as any;

	// const status = data?.status;
	// const user = data?.user;
	// const finished = Boolean(data);
	// const authenticated = status < 205;

	useEffect(() => {
		// if (!finished) return;
		const plainPath = router.asPath.split('#')[0];
		const { allowedRoutes } = getRoutes(me);
		if (me) {
			if (wasLoggedIn) {
				if (!allowedRoutes[plainPath as Routes]) {
					router.push(redirectToIfAuthenticated);
					notification.warning(
						'You do not have permissions to access that page',
						'Unauthorized',
					);
				}
			} else {
				setWasLoggedIn(true);
			}
		} else {
			if (!allowedRoutes[plainPath as Routes]) {
				notification.warning(
					'You do not have permissions to access that page',
					'Unauthorized',
				);
				router.push(redirectToIfUnauthenticated);
			}
		}

		// if (authenticated) {
		// 	if (!me && user) {
		// 		setMe(user);
		// 	} else if (!allowedRoutes[plainPath as Routes]) {
		// 		router.push(redirectToIfAuthenticated);
		// 	}
		// } else if (!me) {
		// 	if (!allowedRoutes[plainPath as Routes]) {
		// 		router.push(redirectToIfUnauthenticated);
		// 	}
		// }
	}, [me, router.asPath]);

	// return { finished };
}
