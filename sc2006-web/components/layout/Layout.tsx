import { Layout as AntdLayout } from 'antd'
import React, { useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { MenuBar } from '.'
import { Spin } from '../common'

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
	<AntdLayout className="w-screen h-screen relative">
		<MenuBar />
		<PageWrapper>{children}</PageWrapper>
	</AntdLayout>
)

const PageWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	useEffect(() => {
		const handleStart = (url: string) =>
			url !== router.asPath && setIsLoading(true)
		// Removed url === router.asPath as it seems possible that url !== asPath
		const handleEnd = () => setIsLoading(false)

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
			{isLoading ? <Spin size="large" center /> : children}
		</div>
	)
}
