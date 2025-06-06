import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, User } from 'firebase/auth';

// Firebase configuration - will be replaced with environment variables
const firebaseConfig = {
  apiKey: "AIzaSyA9XBL7iDWRsPh8vG04NkGgrfpCtOj1GWY",
  authDomain: "transformar-faee3.firebaseapp.com",
  projectId: "transformar-faee3",
  storageBucket: "transformar-faee3.firebasestorage.app",
  messagingSenderId: "670944337910",
  appId: "1:670944337910:web:345998e6bcfb7c83aa31d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Authentication functions
export const signIn = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    return await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export default app;