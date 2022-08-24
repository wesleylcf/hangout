import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { protectedRoutes } from './constants';
import { meService } from './services';

export async function middleware(request: NextRequest) {
	if (protectedRoutes.includes(request.nextUrl.pathname)) {
		// This route is protected by JWT which expires in 8 mins
		const { status } = await meService.revalidate();
		if (status !== 200) {
			// TODO clear the user probably done in frontend
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}
	// TODO if public route, protect /login and /signup if already logged in
}
