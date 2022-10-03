import { Layout as AntdLayout } from 'antd';
import React from 'react';
import { MenuBar, PageTransitionWrapper } from '.';
import {
	GlobalContextProps,
	GlobalContext,
	PageContext,
	PageContextProps,
} from '../../contexts/';
import { NotificationContainer } from '../notification';

interface AppContainerProps {
	children: React.ReactNode;
	meContext: GlobalContextProps;
	pageContext: PageContextProps;
}

export const AppContainer: React.FC<AppContainerProps> = ({
	children,
	meContext,
	pageContext,
}) => {
	return (
		<AntdLayout
			className="w-screen h-screen relative"
			style={{ background: 'none' }}
		>
			<GlobalContext.Provider value={meContext}>
				<NotificationContainer>
					<MenuBar />
					<PageContext.Provider value={pageContext}>
						<PageTransitionWrapper>{children}</PageTransitionWrapper>
					</PageContext.Provider>
				</NotificationContainer>
			</GlobalContext.Provider>
		</AntdLayout>
	);
};
