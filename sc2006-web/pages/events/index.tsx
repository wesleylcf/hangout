import React from 'react';
import { Layout, Divider } from 'antd';

function ListEventsPage() {
	return (
		<Layout className="w-full h-full">
			<Layout.Sider theme="light">
				<div>Created Events</div>
				<div>Invited events</div>
			</Layout.Sider>
			<Divider
				type="vertical"
				style={{ margin: 0, height: '80%', alignSelf: 'center' }}
			></Divider>
		</Layout>
	);
}

export default ListEventsPage;
