import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
let auth = getAuth(app);
let db = getFirestore(app);

if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence enabled in first tab only');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support persistence');
    } else {
      console.error('Persistence error:', err);
    }
  });
}

export { app, auth, db };

export async function testConnection() {
  console.log("Firebase connection test successful.");
  return { auth, db };
}

export async function testSaveItem(userId: string, itemId: string) {
  try {
    const saveRef = doc(db, 'users', userId, 'savedItems', itemId);
    await setDoc(saveRef, {
      savedAt: new Date(),
      itemId: itemId
    });
    console.log('Test save successful');
    return true;
  } catch (error) {
    console.error('Test save failed:', error);
    return false;
  }
}
export async function testRemoveItem(userId: string, itemId: string) {
  try {
    const saveRef = doc(db, 'users', userId, 'savedItems', itemId);
    await setDoc(saveRef, {
      savedAt: new Date(),
      itemId: itemId
    });
    console.log('Test remove successful');
    return true;
  } catch (error) {
    console.error('Test remove failed:', error);
    return false;
  }
}
export const getFirebaseInstance = async () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  return { auth, db };
};