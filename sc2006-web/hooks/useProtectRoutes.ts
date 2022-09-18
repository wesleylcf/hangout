import { useEffect, useContext, Dispatch, useState } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '../contexts/';
import { getRoutes, Routes } from '../lib/routes';
import { useNotification } from './useNotification';

export function useProtectRoutes() {
	const redirectToIfUnauthenticated = '/login';
	const redirectToIfAuthenticated = '/home';
	const router = useRouter();
	const { me, wasLoggedIn, setWasLoggedIn, postLoginPath, setPostLoginPath } =
		useContext(GlobalContext);
	const notification = useNotification();
	const [redirected, setRedirected] = useState(false);

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
	}, [me, router.asPath]);

	return { postLoginPath };
}
