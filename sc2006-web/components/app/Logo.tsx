import React from 'react'
import { ShareAltOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

export function Logo () {
	const router = useRouter()
	return (
		<button
			onClick={() => router.push('/')}
			className="flex justify-start w-2/6 items-center px-5 text-black hover:text-sky-600"
		>
			<ShareAltOutlined className="pr-1" />
      Hangout!
		</button>
	)
}
