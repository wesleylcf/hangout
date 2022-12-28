import { EventService } from './EventService';
import { MeService } from './MeService';
import { NotificationService } from './NotificationService';
import { UserService } from './UserService';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyDrcPILMz--OmCImHgoafMzRZHjwcasMQs',
	authDomain: 'sc2006-ad40a.firebaseapp.com',
	projectId: 'sc2006-ad40a',
	storageBucket: 'sc2006-ad40a.appspot.com',
	messagingSenderId: '792763879490',
	appId: '1:792763879490:web:d0f99c9663784665445ddb',
	measurementId: 'G-WL31NG5QE4',
};
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const meService = new MeService();
export const notificationService = new NotificationService();
export const userService = new UserService();
export const eventService = new EventService();
