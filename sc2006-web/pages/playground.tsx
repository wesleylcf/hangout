import React, { useState, useMemo, ReactNode, useRef, useEffect } from 'react';

interface TreeNode {
	value: ReactNode;
	children?: TreeNode[];
	id: string;
}

type TreeNodeProps = {
	data: TreeNode;
	level: number;
};

interface TreeProps {
	data: TreeNode[];
}

const testData: TreeNode[] = [
	{
		id: '1',
		value: 'test1',
		children: [
			{
				id: '1.1',
				value: 'test1.1',
				children: [
					{
						id: '1.1.1',
						value: 'test1.1.1',
						children: [],
					},
				],
			},
			{
				id: '1.2',
				value: 'test1.2',
				children: [
					{
						id: '1.2.1',
						value: 'test1.2.1',
						children: [],
					},
				],
			},
		],
	},
	{
		id: '2',
		value: 'test2',
		children: [
			{
				id: '2.1',
				value: 'test2.1',
				children: [
					{
						id: '2.1.1',
						value: 'test2.1.1',
						children: [],
					},
				],
			},
			{
				id: '2.2',
				value: 'test2.2',
				children: [
					{
						id: '2.2.1',
						value: 'test2.2.1',
						children: [],
					},
				],
			},
		],
	},
];

const TreeNode: React.FC<TreeNodeProps> = ({ data, level }) => {
	const { value, children } = data;
	const [isExpanded, setIsExpanded] = useState(false);

	const _children = useMemo(
		() =>
			children?.map((child, index) => (
				<TreeNode
					key={`${level}.${level + 1}.${index + 1}`}
					data={child}
					level={level + 1}
				/>
			)),
		[],
	);

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<button
					style={{
						marginRight: '4px',
					}}
					onClick={() => {
						setIsExpanded((prevExpanded) => !prevExpanded);
					}}
					disabled={!_children?.length}
				>
					{isExpanded ? '↓' : '→'}
				</button>
				{value}
			</div>

			<div style={{ marginLeft: `16px` }}>{isExpanded ? _children : null}</div>
		</div>
	);
};

const Tree: React.FC<TreeProps> = ({ data }) => {
	return (
		<div>
			{data.map((datum, index) => (
				<TreeNode key={`root.${index}`} data={datum} level={1} />
			))}
		</div>
	);
};

const PlayGround = (props: any) => {
	return (
		<div className="App">
			<h1>Hello React.</h1>
			<h2>Start editing to see some magic happen!</h2>
			<Tree data={testData} />
		</div>
	);
};

export default PlayGround;
