import { getApps, initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function initializeFirebase() {
  try {
    if (!getApps().length) {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);

      // Enable offline persistence
      if (typeof window !== 'undefined') {
        enableIndexedDbPersistence(db)
          .catch((err) => {
            console.error('Firestore persistence error:', err);
          });
      }

      console.log('Firebase initialized successfully');
      return { auth, db };
    }
    return {
      auth: getAuth(),
      db: getFirestore()
    };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

const { auth, db } = initializeFirebase();
export { auth, db };