import { createContext } from 'react';
import { User } from '../types';
import { UpdateState } from '../hooks/useUpdateState';
export type Me = User;

export interface GlobalContextProps {
	me: Me;
	updateMe: UpdateState<Me>;
	setMe: (me: Me) => void;
}

export const GlobalContext = createContext<GlobalContextProps>(
	undefined as any,
);
