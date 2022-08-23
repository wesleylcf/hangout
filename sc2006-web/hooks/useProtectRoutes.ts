import { useContext, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import { GlobalContext } from '../contexts/GlobalContext'
import { protectRoutes } from '../constants'

// const fetcher = (url: string) =>
// 	axios.get<Response<LoginRes>>(url).then((res) => res.data);

interface useUserProps {
	redirectIfNotFound?: string;
	redirectIfFound?: string;
}

export function useProtectRoute ({
	redirectIfNotFound,
	redirectIfFound
}: useUserProps = {}) {
	const { me } = useContext(GlobalContext)
	// const { data, error } = useSWR(`${process.env.API_URL}/auth/login`, fetcher);
	// const user: User | undefined = data?.data.user;
	// const finished = Boolean(data);
	const hasUser = Boolean(me)
	const router = useRouter()

	useEffect(() => {
		// No route protection
		if (!protectRoutes.includes(router.asPath)) return

		// Route protected and User not found
		if (!hasUser && redirectIfNotFound) {
			// If redirectIfNotFound is set, redirect if the user was not found.
			// TODO toast notification 'You have no access to that page, please login'
			Router.push(redirectIfNotFound)
		}
	}, [redirectIfNotFound, redirectIfFound, hasUser, router.asPath])

	// return me;
}
