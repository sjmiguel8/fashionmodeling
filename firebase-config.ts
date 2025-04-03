import { getApps, initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export async function getFirebaseInstance() {
    const app = initializeApp({
        // Add your Firebase config here
    });
    
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    return { auth, db };
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Debug environment variables
console.log('Firebase Config:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  environment: process.env.NODE_ENV
});

// Validate config before initialization
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    console.warn(`Firebase config missing ${key}`); // Use console.warn instead of throwing error
  }
});

let app = getApps()[0];
try {
  if (!app) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    console.log('Firebase app already initialized');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error; // Re-throw to prevent using uninitialized Firebase
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export async function testConnection() {
  try {
    console.log('Testing Firebase connection...');
    await signInAnonymously(auth);
    console.log('Firebase connection successful');
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    return false;
  }
}

