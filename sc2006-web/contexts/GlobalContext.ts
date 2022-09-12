import { createContext } from 'react';
import { UserRes } from '../types';
export type Me = UserRes;

export interface GlobalContextProps {
	wasLoggedIn: boolean;
	setWasLoggedIn: (value: boolean) => void;
	me?: Me;
	setMe: (me?: Me) => void;
	postLoginPath: string;
	setPostLoginPath: (path: string) => void;
}

export const GlobalContext = createContext<GlobalContextProps>(
	undefined as any,
);
