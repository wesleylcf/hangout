/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch } from 'react';

export interface PageContextProps {
	loading: boolean;
	setLoading: Dispatch<boolean>;
}

export const PageContext = createContext<PageContextProps>({
	loading: false,
	setLoading: () => {},
});
