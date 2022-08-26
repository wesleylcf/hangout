import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import React, { useState } from 'react';
import { AppContainer } from '../containers/app';
import {
	Me,
	GlobalContextProps,
	GlobalContext,
} from '../contexts/GlobalContext';

function MyApp({ Component, pageProps }: AppProps) {
	const [me, setMe] = useState<Me | undefined>(undefined as any);
	const contextValue: GlobalContextProps = {
		me: me!,
		setMe: (me?: Me) => setMe(me),
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
