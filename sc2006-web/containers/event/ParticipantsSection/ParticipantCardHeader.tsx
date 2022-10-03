import { CrownFilled, UserOutlined } from '@ant-design/icons';
import { CollapseItemHeader } from '../../../components/common';

interface ParticipantCardHeaderProps {
	title: string;
	isCreator: boolean;
	isExpanded: boolean;
}

export const ParticipantCardHeader = ({
	isCreator,
	...headerProps
}: ParticipantCardHeaderProps) => {
	const icon = isCreator ? (
		<CrownFilled
			className="pr-2 "
			style={{
				color: 'rgb(232 121 249)',
			}}
		/>
	) : (
		<UserOutlined
			className="pr-2 "
			style={{
				color: 'rgb(232 121 249)',
			}}
		/>
	);
	return <CollapseItemHeader icon={icon} {...headerProps} />;
};
