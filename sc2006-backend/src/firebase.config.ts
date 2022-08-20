// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDrcPILMz--OmCImHgoafMzRZHjwcasMQs',
  authDomain: 'sc2006-ad40a.firebaseapp.com',
  projectId: 'sc2006-ad40a',
  storageBucket: 'sc2006-ad40a.appspot.com',
  messagingSenderId: '792763879490',
  appId: '1:792763879490:web:d0f99c9663784665445ddb',
  measurementId: 'G-WL31NG5QE4',
};

const app = initializeApp(firebaseConfig);
// Commented out as analytics can only run on frontend
// const analytics = getAnalytics(app);
const db = getFirestore();

export { db };
