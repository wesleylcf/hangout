import React, {
	ReactNode,
	useContext,
	useEffect,
	useState,
	useMemo,
} from 'react';
import { Menu } from 'antd';
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
import { GlobalContext } from '../../contexts/';
import { meService } from '../../services';
import { useNotification } from '../../hooks';
import { NotificationInbox } from '../notification';
import { NAVIGATION_HEIGHT } from '../../constants';

type MenuItemKey =
	| 'home'
	| 'events'
	| 'profile'
	| 'login'
	| 'logout'
	| 'signup';
interface MenuBarItem {
	label?: ReactNode;
	key: MenuItemKey;
	icon?: ReactNode;
	title?: string;
}

export function MenuBar() {
	const router = useRouter();
	const { me, setMe } = useContext(GlobalContext);
	const notification = useNotification();
	const [selectedMenuItem, setSelectedMenuItem] = useState('home');

	const ProtectedItems: MenuBarItem[] = useMemo(
		() => [
			{
				label: (
					<div className="flex flex-row items-center justify-center">
						<HomeOutlined className="pr-1" />
						Home
					</div>
				),
				key: 'home',
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
		],
		[me],
	);
	const PublicItems: MenuBarItem[] = useMemo(
		() => [
			{
				label: (
					<div className="flex flex-row items-center justify-center">
						<HomeOutlined className="pr-1" />
						Home
					</div>
				),
				key: 'home',
			},
			getLoginOrSignupButton(router.asPath),
		],
		[me],
	);

	const [menuItems, setMenuItems] = useState(PublicItems);

	useEffect(() => {
		setMenuItems(me ? ProtectedItems : PublicItems);
		setSelectedMenuItem('home');
	}, [me]);

	const onLogout = async () => {
		router.push('/home');
		try {
			await meService.logout();
			setMe(undefined);
			notification.success('Logged out successfully');
		} catch (e: any) {
			notification.apiError(e);
		}
	};

	return (
		<nav
			className="flex flew-row justify-between bg-white"
			style={{ height: NAVIGATION_HEIGHT }}
		>
			<Logo />
			<div className="w-3/6 flex flex-row justify-end">
				<Menu
					items={menuItems}
					selectedKeys={[selectedMenuItem]}
					mode="horizontal"
					className="w-4/5 justify-end"
					expandIcon={<MenuOutlined />}
					onClick={({ key }) => router.push(`/${key}`)}
					style={{ border: 'none' }}
					onSelect={({ key }) => setSelectedMenuItem(key)}
				/>
				{me && (
					<>
						<NotificationInbox uuids={me.notificationIds} />
						<button
							key="logout"
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
function getLoginOrSignupButton(path: string): MenuBarItem {
	return path === '/signup' || path === '/home'
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
