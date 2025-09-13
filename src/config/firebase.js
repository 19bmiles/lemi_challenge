import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQm8fGY5haspAV7pHQKig4HUcGz-JErzs",
  authDomain: "lemi-challenge-2025.firebaseapp.com",
  projectId: "lemi-challenge-2025",
  storageBucket: "lemi-challenge-2025.firebasestorage.app",
  messagingSenderId: "357737087468",
  appId: "1:357737087468:web:444f1561d43a95c1d6c0c9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);