import React, { ReactNode, useContext } from 'react';
import { Menu, notification } from 'antd';
import {
	MenuOutlined,
	LogoutOutlined,
	CalendarOutlined,
	UserOutlined,
	LoginOutlined,
	UserAddOutlined,
	HomeOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { Logo } from '.';
import { NotificationBell } from '../../components/common';
import { GlobalContext } from '../../contexts/';
import { meService } from '../../services';
import { useNotification } from '../../hooks';
import { NotificationInbox } from '../notification';

interface MenuBarItem {
	label?: ReactNode;
	key: string;
	icon?: ReactNode;
	title?: string;
}

const ProtectedItems: MenuBarItem[] = [
	{
		label: (
			<div className="flex flex-row items-center justify-center">
				<HomeOutlined className="pr-1" />
				Home
			</div>
		),
		key: '',
	},
	{
		label: (
			<div className="flex flex-row items-center justify-center">
				<CalendarOutlined className="pr-1" />
				Events
			</div>
		),
		key: 'events',
	},
	{
		label: (
			<div className="flex flex-row items-center justify-center">
				<UserOutlined className="pr-1" />
				Profile
			</div>
		),
		key: 'profile',
	},
];

export function MenuBar() {
	const { me, setMe } = useContext(GlobalContext);
	const router = useRouter();
	const notification = useNotification();

	const AuthItems: MenuBarItem[] = [getLoginOrSignup(router.asPath)];

	const onLogout = async () => {
		try {
			await meService.logout();
			setMe(undefined);
			notification.success('Logged out successfully');
		} catch (e: any) {
			// TODO fire toast notification
			notification.apiError(e);
		}
	};

	return (
		<nav className="flex flew-row bg-white justify-between">
			<Logo />
			<div className="w-3/6 flex flex-row justify-end">
				<Menu
					items={me ? ProtectedItems : AuthItems}
					mode="horizontal"
					className="w-4/5 justify-end"
					expandIcon={<MenuOutlined />}
					onClick={({ key }) => router.push(`/${key}`)}
				/>
				{me && (
					<>
						<NotificationInbox uuids={me.notificationIds} />
						<button
							onClick={onLogout}
							className="flex justify-start items-center px-5 text-black border-b-3 border-red-500 hover:text-red-500  w-1/5"
						>
							<LogoutOutlined className="pr-1" />
							Logout
						</button>
					</>
				)}
			</div>
		</nav>
	);
}

/* eslint-disable no-mixed-spaces-and-tabs */
function getLoginOrSignup(path: string) {
	return path === '/signup' || path === '/'
		? {
				label: (
					<div className="flex flex-row items-center justify-center">
						<LoginOutlined className="pr-1" />
						Login
					</div>
				),
				key: 'login',
		  }
		: {
				label: (
					<div className="flex flex-row items-center justify-center">
						<UserAddOutlined className="pr-1" />
						Sign Up
					</div>
				),
				key: 'signup',
		  };
	/* eslint-enable no-mixed-spaces-and-tabs */
}
