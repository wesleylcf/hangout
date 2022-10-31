import React from 'react';
import { ShareAltOutlined } from '@ant-design/icons';

export function Logo() {
	return (
		<div className="flex justify-start w-1/2 items-center px-10 text-black font-mono">
			<ShareAltOutlined className="pr-1" />
			Hangout!
		</div>
	);
}
