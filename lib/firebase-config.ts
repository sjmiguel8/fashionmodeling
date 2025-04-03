import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app;
let db;
let auth;

async function initializeFirebase() {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);

      // Enable persistence before any other Firestore operations
      if (typeof window !== 'undefined') {
        try {
          await enableIndexedDbPersistence(db);
          console.log('Firestore persistence enabled');
        } catch (err: any) {
          if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence enabled in first tab only');
          } else if (err.code === 'unimplemented') {
            console.warn('Browser doesn\'t support persistence');
          } else {
            console.error('Persistence error:', err);
          }
        }
      }

      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw error;
    }
  } else {
    app = getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
  }

  return { auth, db };
}

export const { auth: globalAuth, db: globalDb } = await initializeFirebase();
export { globalAuth as auth, globalDb as db };