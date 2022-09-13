import { Modal, ModalProps } from 'antd';
import { Me } from '../../contexts';
import { FieldRow } from '../../components/common/FieldRow';
import { useMemo, Dispatch, SetStateAction } from 'react';

type AddFriendToEventModalProps = Omit<ModalProps, 'onOk'> & {
	me: Me;
	isOpen: boolean;
	onOk: (friends: string[]) => void;
	addedFriends: Set<string>;
	selectedFriends: Set<string>;
	setSelectedFriends: Dispatch<SetStateAction<Set<string>>>;
};

export const AddFriendToEventModal = ({
	me,
	isOpen,
	onOk,
	onCancel,
	addedFriends,
	selectedFriends,
	setSelectedFriends,
}: AddFriendToEventModalProps) => {
	const onClickHandler = (key: string) => {
		if (addedFriends.has(key)) {
			return;
		}
		setSelectedFriends((currentSelected) => {
			const newSelected = new Set(currentSelected);
			if (newSelected.has(key)) {
				newSelected.delete(key);
			} else {
				newSelected.add(key);
			}
			return newSelected;
		});
	};

	const friendRows = useMemo(
		() =>
			me.friendIds.map((friend, index) => {
				const key = friend;
				return (
					<FieldRow
						key={key}
						value={`@${friend}`}
						highlight={index % 2 == 0}
						onClick={() => onClickHandler(key)}
						isSelected={selectedFriends && selectedFriends.has(key)}
						isClickDisabled={addedFriends.has(key)}
					/>
				);
			}),
		[selectedFriends, addedFriends],
	);
	return (
		<Modal
			title="Friend List"
			visible={isOpen}
			onOk={() => {
				onOk(Array.from(selectedFriends));
			}}
			onCancel={onCancel}
		>
			{friendRows}
		</Modal>
	);
};
