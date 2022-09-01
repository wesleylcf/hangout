import { Tooltip } from 'antd';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts';
import { Notification } from '../../types';

const NotificationInbox = () => {
	const { me } = useContext(GlobalContext);
	const [notifications, setNotifications] = useState<Notification[]>(
		me?.notifications || [],
	);

	return (
		<Tooltip>
			{notifications.map((notification) => {
				return notification.seenAt ? (
					<p>Seen notification</p>
				) : (
					<p>Unseen notification</p>
				);
			})}
		</Tooltip>
	);
};
