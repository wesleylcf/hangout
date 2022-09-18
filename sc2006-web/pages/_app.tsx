import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { AppContainer } from '../containers/app';
import { Me, GlobalContextProps } from '../contexts/';
import { meService } from '../services';
import { Spin } from '../components/common';

function MyApp({ Component, pageProps }: AppProps) {
	const [me, setMe] = useState<Me | undefined>(undefined as any);
	const [wasLoggedIn, setWasLoggedIn] = useState(false);
	const [isAppLoading, setIsAppLoading] = useState(true);
	const [postLoginPath, setPostLoginPath] = useState('/home');
	const contextValue: GlobalContextProps = {
		wasLoggedIn,
		setWasLoggedIn: (bool: boolean) => setWasLoggedIn(bool),
		me: me!,
		setMe: (me?: Me) => setMe(me),
		postLoginPath: postLoginPath,
		setPostLoginPath: (path: string) => setPostLoginPath(path),
	};

	useEffect(() => {
		const reconstructUser = async () => {
			let user;
			try {
				setIsAppLoading(true);
				user = await meService.reconstructUser();
				setMe(user);
			} catch (e) {
				// No JWT token, so we cannot reconstructUser(401 response)
			}
			setTimeout(() => setIsAppLoading(false), 300);
		};
		reconstructUser();
	}, []);
	if (isAppLoading) {
		return (
			<div className="w-screen h-screen flex flex-row justify-center items-center">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<AppContainer meContext={contextValue}>
			<Component {...pageProps} />
		</AppContainer>
	);
}

export default MyApp;
