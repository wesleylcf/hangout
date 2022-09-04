export type Routes =
	| '/home'
	| '/login'
	| '/signup'
	| '/create-event'
	| '/events'
	| '/profile';

import { Me } from '../../contexts/GlobalContext';

export function getRoutes(me?: Me) {
	const publicRoutes = {
		'/home': true,
		'/login': true,
		'/signup': true,
		'/create-event': false,
		'/events': false,
		'/profile': false,
	};

	const authRoutes = {
		'/home': true,
		'/login': false,
		'/signup': false,
		'/create-event': true,
		'/events': true,
		'/profile': true,
	};

	const allowedRoutes = me ? authRoutes : publicRoutes;

	return {
		allowedRoutes,
	};
}
