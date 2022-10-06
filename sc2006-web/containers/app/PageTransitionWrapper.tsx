import { useRouter } from 'next/router';
import { useEffect, ReactNode, useState, useContext } from 'react';
import { Spin } from '../../components/common';
import { PageContext } from '../../contexts';
import { useProtectRoutes } from '../../hooks';
import { NAVIGATION_HEIGHT } from '../../constants';

interface PageTransitionWrapperProps {
	children: ReactNode;
}

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
	children,
}) => {
	const router = useRouter();
	const { loading } = useContext(PageContext);
	const [internalLoading, setInternalLoading] = useState(false);
	useProtectRoutes();

	useEffect(() => {
		const handleStart = (url: string) =>
			url !== router.asPath && setInternalLoading(true);
		// Removed url === router.asPath as it seems possible that url !== asPath
		const handleEnd = () => setInternalLoading(false);

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleEnd);
		router.events.on('routeChangeError', handleEnd);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleEnd);
			router.events.off('routeChangeError', handleEnd);
		};
	});

	return (
		<div
			className="flex flex-row items-center justify-center w-full h-full"
			style={{ marginTop: NAVIGATION_HEIGHT }}
		>
			{internalLoading || loading ? <Spin size="large" center /> : children}
		</div>
	);
};
