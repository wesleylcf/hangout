import React from 'react';
import { Timeline } from 'antd';
import { DemoApp } from './DemoApp';

export const Demo = () => {
	return (
		<div className="w-full h-full space-y-10">
			<section className="flex flex-col space-y-8 items-center h-screen">
				<div className="w-full h-3/5 flex flex-row items-center justify-center">
					Insert graphics
				</div>
				<h1 className="text-2xl text-pink-400 left-1/2 mt-8">
					Planning outings made simple.
				</h1>
				<div className="flex flex-col items-center text-xl space-y-4">
					<p>
						Always end up rescheduling outings? Have no idea where to go next?
					</p>
					<p>
						Simply add an existing user or manually enter someone&#39;s
						preferences, schedule, and address and leave the rest to us!
					</p>
				</div>
			</section>
			<section className="flex flex-col space-y-8 items-center bg-gray-50">
				<h1 className="text-2xl text-sky-400 left-1/2 mt-8">
					Here&#39;s how it works.
				</h1>
				<div className="w-full flex flex-row">
					<div className="w-1/2 pl-16 flex flex-row items-center justify-center">
						Insert graphics
					</div>
					<Timeline className="w-1/2" style={{ padding: '4rem' }}>
						<Timeline.Item color="green" style={{ paddingBottom: '3rem' }}>
							<p className="text-xl">Tell us your address</p>
							<p>
								This is used to suggest places which are most commute-friendly
								for everyone involved
							</p>
						</Timeline.Item>
						<Timeline.Item color="green" style={{ paddingBottom: '3rem' }}>
							<p className="text-xl">Tell us your preferences</p>
							<p>
								This is used to suggest places which fall under the interests of
								most or everyone involved.
							</p>
						</Timeline.Item>
						<Timeline.Item color="green" style={{ paddingBottom: '3rem' }}>
							<p className="text-xl">Tell us what your schedule looks like</p>
							<p>
								This is used to suggest the time and duration of the event, and
								affects the places that we will suggest.
							</p>
						</Timeline.Item>
						<Timeline.Item color="green" style={{ paddingBottom: '3rem' }}>
							<p className="text-xl">
								Once we have the details of everyone involved, give us a moment
								to generate the results!
							</p>
						</Timeline.Item>
					</Timeline>
				</div>
			</section>
			<section className="flex flex-col space-y-8 items-center min-h-screen">
				<h1 className="text-2xl text-yellow-400 left-1/2 mt-8">Try it out!</h1>
				<DemoApp />
			</section>
		</div>
	);
};
