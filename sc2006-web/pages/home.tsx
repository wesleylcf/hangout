import type { NextPage } from 'next';
import { useContext } from 'react';
import { Home, Demo } from '../containers/home';
import { GlobalContext } from '../contexts';

const HomePage: NextPage = () => {
	const { me } = useContext(GlobalContext);
	return me ? <Home me={me} /> : <Demo />;
};

export default HomePage;
