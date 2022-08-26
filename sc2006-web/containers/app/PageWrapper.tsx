import { useRouter } from 'next/router';
import { useEffect, ReactNode, useState } from 'react';
import { Spin } from '../../components/common';

interface PageWrapperProps {
	isLoading: boolean;
	children: ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
	children,
	isLoading,
}) => {
	const router = useRouter();
	const [internalLoading, setInternalLoading] = useState(false);

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
			{internalLoading || isLoading ? <Spin size="large" center /> : children}
		</div>
	);
};
