import { useRouter } from 'next/router';
import { useEffect, ReactNode, useState } from 'react';
import { Spin } from '../../components/common';
import { useProtectRoutes } from '../../hooks';

interface PageTransitionWrapperProps {
	children: ReactNode;
}

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
	children,
}) => {
	const router = useRouter();
	const [internalLoading, setInternalLoading] = useState(false);
	const protect = useProtectRoutes();

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
		<div className="flex flex-row items-center justify-center w-full h-full">
			{internalLoading ? <Spin size="large" center /> : children}
		</div>
	);
};
