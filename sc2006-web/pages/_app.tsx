import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import React, { useState } from 'react';
import { AppContainer } from '../containers/app';
import { Me, GlobalContextProps } from '../contexts/';
import { NotificationRes } from '../types';

function MyApp({ Component, pageProps }: AppProps) {
	const [me, setMe] = useState<Me | undefined>(undefined as any);
	const [notifications, setNotifications] = useState<Array<NotificationRes>>(
		[],
	);
	const contextValue: GlobalContextProps = {
		me: me!,
		setMe: (me?: Me) => setMe(me),
		notifications: notifications,
		setNotifications: (_notifications: NotificationRes[]) =>
			setNotifications(_notifications),
	};

	return (
		<AppContainer meContext={contextValue}>
			<Component {...pageProps} />
		</AppContainer>
	);
}

export default MyApp;
