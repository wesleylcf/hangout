import React from 'react';
import { useProtectRoutes } from '../../hooks';

function CreateEventPage() {
	const finished = useProtectRoutes();
	return <div>CreateEventPage</div>;
}

export default CreateEventPage;
