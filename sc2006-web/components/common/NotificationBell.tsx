import { BellOutlined } from '@ant-design/icons';

export const NotificationBell = () => {
	return (
		<button
			className="flex flex-row justify-center items-center px-5 hover:text-emerald-400"
			style={{ fontSize: '120%' }}
		>
			<BellOutlined />
		</button>
	);
};
