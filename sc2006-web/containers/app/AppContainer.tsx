import { Layout as AntdLayout } from 'antd';
import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { MenuBar, PageTransitionWrapper } from '.';
import { useProtectRoutes } from '../../hooks';
import { Me, GlobalContextProps, GlobalContext } from '../../contexts/';
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
