export type Routes =
	| '/'
	| '/login'
	| '/signup'
	| '/create-event'
	| '/events'
	| '/profile';

import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';

export function useRoutes() {
	const publicRoutes = {
		'/': true,
		'/login': true,
		'/signup': true,
		'/create-event': false,
		'/events': false,
		'/profile': false,
	};

	const authRoutes = {
		'/': true,
		'/login': false,
		'/signup': false,
		'/create-event': true,
		'/events': true,
		'/profile': true,
	};

	const [allowedRoutes, setRoutes] =
		useState<Record<Routes, boolean>>(publicRoutes);
	const { me } = useContext(GlobalContext);
	useEffect(() => {
		if (me?.username) {
			setRoutes(authRoutes);
		} else {
			setRoutes(publicRoutes);
		}
	}, [me]);

	return {
		allowedRoutes,
	};
}
