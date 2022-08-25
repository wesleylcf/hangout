import { useState, useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import { meService } from '../services';
import { useRouter } from 'next/router';
import { protectedRoutes } from '../constants';

interface ProtectRouteResult {
	finished: boolean;
}

export function useProtectRoutes(
	redirectIfNotFound = '/',
	redirectIfFound = '/login',
): ProtectRouteResult {
	const { data, error } = useSWR('/revalidate', meService.revalidate);
	const router = useRouter();
	const status = data?.status;
	const finished = Boolean(data);
	const authenticated = status === 200;

	useEffect(() => {
		if (!finished) return;
		// If redirectIfNotFound is set, redirect if the user was not found.
		if (!authenticated && protectedRoutes.includes(router.asPath)) {
			router.push(redirectIfNotFound);
		}
	}, [redirectIfNotFound, redirectIfFound, finished, authenticated]);

	return { finished };
}
