import { createContext } from 'react';
import { NotificationRes, User } from '../types';
import { UpdateState } from '../hooks/useUpdateState';
export type Me = User;

export interface GlobalContextProps {
	me?: Me;
	setMe: (me?: Me) => void;
	notifications: NotificationRes[];
	setNotifications: (notifications: NotificationRes[]) => void;
}

export const GlobalContext = createContext<GlobalContextProps>(
	undefined as any,
);
