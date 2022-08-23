import { Layout as AntdLayout } from 'antd'
import React, { useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { MenuBar } from '.'
import { Spin } from '../common'
import { useProtectRoute } from '../../hooks'

interface AppContainerProps {
	children: React.ReactNode;
}

export const AppContainer: React.FC<AppContainerProps> = ({ children }) => (
	<AntdLayout className="w-screen h-screen relative">
		<MenuBar />
		<PageWrapper>{children}</PageWrapper>
	</AntdLayout>
)

const PageWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
	const router = useRouter()
	useProtectRoute({
		redirectIfNotFound: '/login',
		redirectIfFound: '/'
	})
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const handleStart = (url: string) =>
			url !== router.asPath && setLoading(true)
		// Removed url === router.asPath as it seems possible that url !== asPath
		const handleEnd = () => setLoading(false)

		router.events.on('routeChangeStart', handleStart)
		router.events.on('routeChangeComplete', handleEnd)
		router.events.on('routeChangeError', handleEnd)

		return () => {
			router.events.off('routeChangeStart', handleStart)
			router.events.off('routeChangeComplete', handleEnd)
			router.events.off('routeChangeError', handleEnd)
		}
	})

	return (
		<div className="flex flex-row items-center justify-center w-full h-full">
			{loading ? <Spin size="large" center /> : children}
		</div>
	)
}
