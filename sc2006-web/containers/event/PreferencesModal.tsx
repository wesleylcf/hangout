/* eslint-disable @typescript-eslint/ban-types*/
import React, { useState } from 'react';
import { Badge, Calendar, Collapse, Modal, ModalProps, BadgeProps } from 'antd';
import { CollapseItemHeader } from '../../components/common';
import { TreeSelect } from 'antd';

type PreferencesModalProps = Omit<ModalProps, 'onOk'> & {
	onOk: (value: any) => void;
};

export const PreferencesModal = ({ onOk, ...props }: PreferencesModalProps) => {
	const treeData = [
		{
			title: 'Activities',
			key: '0-0',
			value: 'activities',
			children: [
				{
					title: 'Community Centres',
					key: '0-0-0',
					value: 'activity.community_center',
				},
				{
					title: 'Sport Clubs',
					key: '0-0-1',
					value: 'activity.sport_club',
				},
			],
		},
		{
			title: 'Shopping',
			key: '0-1',
			value: 'commercial',
			children: [
				{
					title: 'Outdoor and sports shops',
					key: '0-1-0',
					value: 'commercial.outdoor_and_sport',
				},
				{
					title: 'Shopping malls',
					key: '0-1-1',
					value: 'commercial.shopping_mall',
				},
				{
					title: 'Department stores',
					key: '0-1-2',
					value: 'commercial.department_store',
				},
				{
					title: 'Hobby-related shops',
					key: '0-1-3',
					value: 'commercial.hobby',
				},
				{
					title: 'Book shops',
					key: '0-1-4',
					value: 'commercial.books',
				},
				{
					title: 'Gift and Souvenir shops',
					key: '0-1-5',
					value: 'commercial.gift_and_souvenir',
				},
				{
					title: 'Tickets and lottery shops',
					key: '0-1-6',
					value: 'commercial.tickets_and_lottery',
				},
				{
					title: 'Clothing and Bags',
					key: '0-1-7',
					value: ['commercial.clothing', 'commercial.bag'],
				},
				{
					title: 'Healthy and Beauty shops',
					key: '0-1-8',
					value: 'commercial.health_and_beauty',
				},
				{
					title: 'Food and Drinks',
					key: '0-1-9',
					value: 'commercial.food_and_drink',
				},
				{
					title: 'Art and Antiques shops',
					key: '0-1-10',
					value: ['commercial.art', 'commercial.antiques'],
				},
				{
					title: 'Video and Music shops',
					key: '0-1-11',
					value: 'commercial.video_and_music',
				},
			],
		},
		{
			title: 'Food',
			key: '0-2',
			value: 'catering',
			children: [
				{
					title: 'Restaurants',
					key: '0-2-0',
					value: 'catering.restaurant',
				},
				{
					title: 'Fast food',
					key: '0-2-1',
					value: 'catering.fast_food',
				},
				{
					title: 'Cafes',
					key: '0-2-2',
					value: 'catering.cafe',
				},
				{
					title: 'Food courts',
					key: '0-2-3',
					value: 'catering.food_court',
				},
				{
					title: 'Bars and Pubs',
					key: '0-2-4',
					value: ['catering.bar', 'catering.pub'],
				},
				{
					title: 'Ice cream',
					key: '0-2-5',
					value: 'catering.ice_cream',
				},
			],
		},
		{
			title: 'Entertainment',
			key: '0-3',
			value: 'entertainment',
			children: [
				{
					title: 'Culture',
					key: '0-3-0',
					value: 'entertainment.culture',
				},
				{
					title: 'Zoo',
					key: '0-3-1',
					value: 'entertainment.zoo',
				},
				{
					title: 'Entertainment',
					key: '0-3-2',
					value: 'entertainment.aquarium',
				},
				{
					title: 'Planetarium',
					key: '0-3-3',
					value: 'entertainment.planetarium',
				},
				{
					title: 'Cinema',
					key: '0-3-4',
					value: 'entertainment.cinema',
				},
				{
					title: 'Arcade',
					key: '0-3-5',
					value: 'entertainment.amusement_arcade',
				},
				{
					title: 'Escape-room',
					key: '0-3-6',
					value: 'entertainment.escape_game',
				},
				{
					title: 'Miniature golf',
					key: '0-3-7',
					value: 'entertainment.miniature_golf',
				},
				{
					title: 'Bowling Alley',
					key: '0-3-8',
					value: 'entertainment.bowling_alley',
				},
				{
					title: 'Theme park',
					key: '0-3-9',
					value: 'entertainment.theme_park',
				},
				{
					title: 'Flying fox',
					key: '0-3-10',
					value: 'entertainment.flying_fox',
				},
				{
					title: 'Water park',
					key: '0-3-11',
					value: 'entertainment.water_park',
				},
			],
		},
		{
			title: 'Leisure',
			key: '0-4',
			value: 'leisure',
			children: [
				{
					title: 'Picnic',
					key: '0-4-0',
					value: 'leisure.picnic',
				},
				{
					title: 'Barbecue',
					key: '0-4-1',
					value: 'leisure.picnic.bbq',
				},
				{
					title: 'Playground',
					key: '0-4-2',
					value: 'leisure.playground',
				},
				{
					title: 'Spa',
					key: '0-4-3',
					value: 'leisure.spa',
				},
				{
					title: 'Park',
					key: '0-4-4',
					value: 'leisure.park',
				},
			],
		},
		{
			title: 'Nature',
			key: '0-5',
			value: 'natural',
		},
		{
			title: 'Nation Park',
			key: '0-6',
			value: 'national_park',
		},
		{
			title: 'Rental',
			key: '0-7',
			value: 'rental',
		},
		{
			title: 'Tour spots',
			key: '0-8',
			value: 'tourism',
			children: [
				{
					title: 'Attractions',
					key: '0-7',
					value: 'tourism.attraction',
				},
				{
					title: 'Sights',
					key: '0-7',
					value: 'tourism.sights',
				},
			],
		},
		{
			title: 'Camping',
			key: '0-8',
			value: 'camping',
		},
		{
			title: 'Beach',
			key: '0-9',
			value: 'beach',
		},
		{
			title: 'Adult stuff',
			key: '0-10',
			value: 'adult',
			children: [
				{
					title: 'Night club',
					key: '0-10-0',
					value: 'adult.nightclub',
				},
				{
					title: 'Strip club',
					key: '0-10-1',
					value: 'adult.stripclub',
				},
				{
					title: 'Casino',
					key: '0-10-2',
					value: 'adult.casino',
				},
				{
					title: 'Adult Gaming Centre',
					key: '0-10-3',
					value: 'adult.adult_gaming_centre',
				},
			],
		},
	];

	const [selectedTypes, setSelectedTypes] = useState<Array<string>>([]);

	return (
		<Modal {...props} onOk={() => onOk(selectedTypes)}>
			<div className="flex flex-row p-8">
				<p>
					Please be as specific as you can in choosing your preferences,
					otherwise the results suggested to you may not be ideal.
				</p>
				<TreeSelect
					treeData={treeData}
					value={Array.from(selectedTypes)}
					onChange={(values) => setSelectedTypes(values)}
					treeCheckable
					showCheckedStrategy="SHOW_PARENT"
					placeholder="Please select one or more place types you are interested in"
					style={{ width: '100%', minHeight: '24rem' }}
				/>
			</div>
		</Modal>
	);
};
