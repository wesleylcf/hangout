import { Layout as AntdLayout } from 'antd';
import React from 'react';
import { MenuBar, PageTransitionWrapper } from '.';
import { GlobalContextProps, GlobalContext } from '../../contexts/';
import { NotificationContainer } from '../notification';

interface AppContainerProps {
	children: React.ReactNode;
	meContext: GlobalContextProps;
}

export const AppContainer: React.FC<AppContainerProps> = ({
	children,
	meContext,
}) => {
	return (
		<AntdLayout
			className="w-screen h-screen relative"
			style={{ background: 'none' }}
		>
			<GlobalContext.Provider value={meContext}>
				<NotificationContainer>
					<MenuBar />
					<PageTransitionWrapper>{children}</PageTransitionWrapper>
				</NotificationContainer>
			</GlobalContext.Provider>
		</AntdLayout>
	);
};
