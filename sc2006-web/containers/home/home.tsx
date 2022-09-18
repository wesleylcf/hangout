import React from 'react';
import { GreetingHeader } from '../../components/common';
import { Me } from '../../contexts';

interface HomePageProps {
	me: Me;
}

export const Home = ({ me }: HomePageProps) => {
	const now = new Date();
	return (
		<div className="w-full h-full">
			<GreetingHeader
				now={now}
				name={me.uuid}
				className="flex flex-row items-center text-xl pl-8 pt-8"
				nameClassName="text-cyan-400 pl-2"
			/>
		</div>
	);
};
