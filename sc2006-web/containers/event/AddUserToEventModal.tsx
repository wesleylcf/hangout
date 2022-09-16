import { Modal, ModalProps, Form } from 'antd';
import { Me } from '../../contexts';
import { TextInput } from '../../components/common';
import { Regex } from '../../types/constants';
import { userService } from '../../services';
import { useNotification } from '../../hooks';

type AddUserToEventModalProps = Omit<ModalProps, 'onOk'> & {
	me: Me;
	isOpen: boolean;
	onOk: (user: string) => void;
	addedParticipants: Set<string>;
};

export const AddUserToEventModal = ({
	me,
	isOpen,
	onOk,
	onCancel,
	addedParticipants,
}: AddUserToEventModalProps) => {
	const notification = useNotification();
	const [form] = Form.useForm();
	const { getFieldValue, setFieldValue, validateFields } = form;

	const formInitialValues = {
		email: '',
	};
	return (
		<Modal
			title="Add A User By Email"
			visible={isOpen}
			onOk={async () => {
				try {
					await validateFields();
					const email = getFieldValue('email');
					if (addedParticipants.has(email)) {
						notification.warning(
							`User ${email} is already added to this Event`,
							'User already added',
						);
						return;
					}
					await userService.checkExistingUser(email);
					onOk(email);
				} catch (e: any) {
					// If it is a PresentableError
					if (e.level) {
						notification.apiError(e);
					} else {
						notification.error(e.message, 'Invalid Email Input');
					}
				}
			}}
			onCancel={onCancel}
			destroyOnClose
		>
			<Form form={form} initialValues={formInitialValues}>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							message: 'Email cannot be empty',
						},
						{
							pattern: Regex.EMAIL,
							message: 'Invalid email entered',
						},
					]}
				>
					<TextInput
						value={getFieldValue('email')}
						onChange={(e: any) => setFieldValue('email', e.target.value)}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};
