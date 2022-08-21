import React, { useState, useContext } from 'react';
import { TextInput, InputLabel, Card, Button } from '../components/common';
import { Form } from 'antd';
import { meService } from '../services';
import { GlobalContext, Me } from '../contexts/GlobalContext';

const login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { setMe } = useContext(GlobalContext);

	const onSubmit = async () => {
		try {
			const user = await meService.login({ username, password });
			setMe(user);
		} catch (e) {
			// toast notification
		}
	};
	return (
		<Card className="p-5 w-3/6 flex flex-col justify-center items-start space-y-2">
			<Form>
				<InputLabel>Email</InputLabel>
				<TextInput
					value={username}
					onChange={(e: any) => setUsername(e.target.value)}
				/>
				<InputLabel>Password</InputLabel>
				<TextInput
					value={password}
					onChange={(e: any) => setPassword(e.target.value)}
				/>
				<div className="pt-2 flex flex-row items-center space-x-4">
					<Button shape="round" size="middle" type="primary">
						Login
					</Button>
					<div className="flex flex-row items-center">
						Need an account? <a className="pl-2">Sign up</a>
					</div>
				</div>
			</Form>
		</Card>
	);
};

export default login;
