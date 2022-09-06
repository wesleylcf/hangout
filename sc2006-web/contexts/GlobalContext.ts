import { createContext } from 'react';
import { User } from '../types';
export type Me = User;

export interface GlobalContextProps {
	me?: Me;
	setMe: (me?: Me) => void;
}

export const GlobalContext = createContext<GlobalContextProps>(
	undefined as any,
);
