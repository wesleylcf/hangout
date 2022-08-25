import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import React from 'react';
import { AppContainer } from '../containers/app';
import {
	Me,
	GlobalContextProps,
	GlobalContext,
} from '../contexts/GlobalContext';
import { useUpdateState } from '../hooks';
import axios from 'axios';

function MyApp({ Component, pageProps }: AppProps) {
	const [me, updateMe, setMe] = useUpdateState<Me>(undefined as any);
	const contextValue: GlobalContextProps = {
		me: me!,
		updateMe,
		setMe,
	};

	return (
		<GlobalContext.Provider value={contextValue}>
			<AppContainer>
				<Component {...pageProps} />
			</AppContainer>
		</GlobalContext.Provider>
	);
}

export default MyApp;
