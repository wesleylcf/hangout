import { useEffect, useContext, Dispatch, useState } from 'react';
import useSWR from 'swr';
import { meService } from '../services';
import { useRouter } from 'next/router';
import { GlobalContext } from '../contexts/';
import { getRoutes, Routes } from '../lib/routes';
import { useNotification } from './useNotification';

// interface useProtectRoutesProps {
// 	setLoading: () => void;
// }

export function useProtectRoutes() {
	const redirectToIfUnauthenticated = '/login';
	const redirectToIfAuthenticated = '/home';
	const router = useRouter();
	const { me, wasLoggedIn, setWasLoggedIn, postLoginPath, setPostLoginPath } =
		useContext(GlobalContext);
	const notification = useNotification();
	const [redirected, setRedirected] = useState(false);
	// const username = me?.username;

	// const fetcher = async () => await meService.revalidate(username);
	// const { data, error } = useSWR('/revalidate', fetcher) as any;

	// const status = data?.status;
	// const user = data?.user;
	// const finished = Boolean(data);
	// const authenticated = status < 205;

	/*
		Push notification once per redirect
	*/
	const onUnauthorized = (path: string) => {
		setRedirected((prevRedirect) => {
			// first instance of redirect, push a notification
			if (!prevRedirect) {
				notification.warning(
					'You do not have permission to access that page',
					'Unauthorized',
				);
				setPostLoginPath(path);
			}
			return true;
		});
	};

	useEffect(() => {
		// if (!finished) return;
		const plainPath = router.asPath.split('#')[0];
		const { allowedRoutes } = getRoutes(me);
		if (me) {
			if (wasLoggedIn) {
				if (!allowedRoutes[plainPath as Routes]) {
					onUnauthorized(plainPath);
					router.push(redirectToIfAuthenticated);
				}
			} else {
				setWasLoggedIn(true);
			}
		} else {
			if (!allowedRoutes[plainPath as Routes]) {
				onUnauthorized(plainPath);
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

	return { postLoginPath };
}
