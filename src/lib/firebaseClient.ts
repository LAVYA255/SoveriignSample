import { initializeApp } from 'firebase/app';
/*
  CRITICAL SETUP REQUIRED:
  1. Go to Firebase Console
  2. Select the project
  3. Go to Authentication -> Sign-in methods
  4. Click Email/Password
  5. Toggle "Enable"
  6. Click Save
  Email registration will NOT work until this is done.
*/
import { getAuth, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signOut = () => firebaseSignOut(auth);
export { auth, googleProvider };
