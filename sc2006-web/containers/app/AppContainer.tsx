import { Layout as AntdLayout } from 'antd';
import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { MenuBar, PageWrapper } from '.';
import { useProtectRoutes } from '../../hooks';

interface AppContainerProps {
	children: React.ReactNode;
}

export const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
	const { finished } = useProtectRoutes();
	return (
		<AntdLayout className="w-screen h-screen relative">
			<MenuBar />
			<PageWrapper isLoading={!finished}>{children}</PageWrapper>
		</AntdLayout>
	);
};
