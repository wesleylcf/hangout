import { createContext } from 'react'
import { User } from '../../sc2006-common/src/constants'
import { UpdateState } from '../hooks/useUpdateState'
export interface Me extends User {
	// other stuff
}

export interface GlobalContextProps {
	me: Me;
	updateMe: UpdateState<Me>;
	setMe: (me: Me) => void;
}

export const GlobalContext = createContext<GlobalContextProps>(
	undefined as any
)
