import React, { ReactNode, useContext } from 'react';
import { Menu } from 'antd';
import {
	MenuOutlined,
	LogoutOutlined,
	CalendarOutlined,
	SettingOutlined,
	LoginOutlined,
	UserAddOutlined,
	HomeOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { Logo } from '.';
import { GlobalContext } from '../../contexts/GlobalContext';

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
				<SettingOutlined className="pr-1" />
				Profile
			</div>
		),
		key: 'profile',
	},
];

export function MenuBar() {
	const { me } = useContext(GlobalContext);
	const router = useRouter();

	const AuthItems: MenuBarItem[] = [getLoginOrSignup(router.asPath)];

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
					<button
						onClick={() => router.push('/')}
						className="flex justify-start items-center px-5 text-black hover:text-sky-600 w1/5"
					>
						<LogoutOutlined className="pr-1" />
						Logout
					</button>
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
