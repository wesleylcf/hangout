import React, { useContext } from 'react';
import { Form } from 'antd';
import { meService, notificationService } from '../services';
import { GlobalContext } from '../contexts/';
import { useRouter } from 'next/router';
import { AuthForm, AuthFormType } from '../components/auth';
import { useNotification } from '../hooks';

interface LoginForm {
	email: string;
	password: string;
}

const Login = () => {
	const [form] = Form.useForm<LoginForm>();
	const { setMe, setNotifications } = useContext(GlobalContext);
	const router = useRouter();
	const notification = useNotification();

	const onSubmit = async (form: LoginForm) => {
		const { email, password } = form;
		try {
			const user = await meService.login({ username: email, password });
			setMe(user!);
			const notifications = await notificationService.getUserNotifications({
				notificationUuids: user.notificationIds,
			});
			setNotifications(notifications);
			router.push('/');
		} catch (e: any) {
			notification.apiError(e);
		}
	};

	return <AuthForm type={AuthFormType.LOGIN} onSubmit={onSubmit} form={form} />;
};

export default Login;
