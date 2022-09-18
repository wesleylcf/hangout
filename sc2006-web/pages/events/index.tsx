import React, { useState, ReactNode, useMemo, useRef, useEffect } from 'react';
import { Layout, Divider, Menu } from 'antd';
import { useRouter } from 'next/router';
import { NAVIGATION_HEIGHT } from '../../constants';
import { PlusCircleFilled } from '@ant-design/icons';

enum EventMenuItemType {
	CREATED_EVENTS = '#created',
	INVITED_EVENTS = '#invited',
	INVITATIONS = '#invitations',
	ACTIVE_EVENTS = '#active',
	EXPIRED_EVENTS = '#past',
}

interface EventMenuItem {
	label?: ReactNode;
	key: EventMenuItemType;
	icon?: ReactNode;
	title?: string;
	children?: Array<ReactNode | EventMenuItem>;
}

function ListEventsPage() {
	const eventMenuItems: EventMenuItem[] = useMemo(
		() => [
			{
				key: EventMenuItemType.CREATED_EVENTS,
				label: 'Created Events',
			},
		],
		[],
	);
	const onCreateEvent = () => {
		router.push('/events/create');
	};

	const [selectedMenuItem, setSelectedMenuItem] = useState(
		EventMenuItemType.CREATED_EVENTS,
	);
	const refs = {
		created: useRef(null as any),
		invitations: useRef(null as any),
		active: useRef(null as any),
		expired: useRef(null as any),
	};
	const router = useRouter();

	useEffect(() => {
		switch (selectedMenuItem) {
			case EventMenuItemType.CREATED_EVENTS:
				window.scrollTo(0, 0);
				break;
			case EventMenuItemType.INVITATIONS:
				window.scrollTo(0, refs.invitations.current.offsetTop);
				break;
			case EventMenuItemType.ACTIVE_EVENTS:
				window.scrollTo(0, refs.active.current.offsetTop);
				break;
			case EventMenuItemType.EXPIRED_EVENTS:
				window.scrollTo(0, refs.expired.current.offsetTop);
				break;
			default:
				window.scrollTo(0, 0);
		}
	}, [selectedMenuItem]);

	return (
		<Layout
			className="w-full h-full bg-white"
			hasSider={true}
			style={{ background: 'none' }}
		>
			<Layout.Sider
				theme="light"
				width={275}
				className="fixed top-0 left-0"
				style={{
					overflow: 'auto',
					height: 'calc(100vh - 45px)',
					position: 'fixed',
					left: 0,
					top: 45,
					bottom: 0,
				}}
			>
				<Menu
					items={eventMenuItems}
					selectedKeys={[selectedMenuItem]}
					mode="horizontal"
					className="w-full flex flex-col p-4"
					style={{ border: 'none' }}
					onSelect={({ key }) => setSelectedMenuItem(key as EventMenuItemType)}
				/>
				<Menu
					items={[
						{
							key: EventMenuItemType.INVITED_EVENTS,
							label: 'Invited Events',
							children: [
								{
									key: EventMenuItemType.INVITATIONS,
									label: 'Invitations',
								},
								{
									key: EventMenuItemType.ACTIVE_EVENTS,
									label: 'Current Events',
								},
								{ key: EventMenuItemType.EXPIRED_EVENTS, label: 'Past Events' },
							],
						},
					]}
					selectedKeys={[selectedMenuItem]}
					mode="horizontal"
					className="w-full flex flex-col p-4 "
					style={{ border: 'none' }}
					onSelect={({ key }) => setSelectedMenuItem(key as EventMenuItemType)}
				/>
			</Layout.Sider>
			<Divider
				type="vertical"
				style={{
					marginLeft: 270,
					height: `calc(100vh - ${2 * NAVIGATION_HEIGHT}px)`,
					overflow: 'auto',
					position: 'fixed',
					left: 0,
					top: NAVIGATION_HEIGHT,
					bottom: NAVIGATION_HEIGHT,
				}}
				className="bg-sky-400 inline-block"
			></Divider>
			<Layout style={{ background: 'none', marginLeft: 275 }}>
				<Layout.Content className="w-full h-full flex flex-col p-16 space-y-12">
					<h1 ref={refs.created}>Created Events</h1>
					<h1>Invited Events</h1>
					<h2 ref={refs.invitations}>Invitations</h2>
					<h2 ref={refs.active}>Current Events</h2>
					<h2 ref={refs.expired} className="h-screen">
						Past Events
					</h2>
				</Layout.Content>
			</Layout>
			<PlusCircleFilled
				style={{
					color: 'rgb(34 211 238)',
					position: 'fixed',
					bottom: 45,
					right: 45,
					fontSize: '4rem',
				}}
				onClick={onCreateEvent}
			/>
		</Layout>
	);
}

export default ListEventsPage;
