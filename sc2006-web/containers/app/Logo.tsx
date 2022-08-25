import React from 'react';
import { ShareAltOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

export function Logo() {
	return (
		<div className="flex justify-start w-2/6 items-center px-5 text-black">
			<ShareAltOutlined className="pr-1" />
			Hangout!
		</div>
	);
}
