import { auth, db, testConnection } from './firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import type { ClothingItem } from "./types"

// Add this to any page component to test Firebase
import { testConnection } from '../lib/firebase-config';

// In your component:
useEffect(() => {
  testConnection().then(connected => {
    console.log('Firebase connection status:', connected);
  });
}, []);

let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Firebase is not properly initialized');
    }
    isInitialized = true;
  }
}

export async function registerUser(email: string, password: string) {
  await ensureInitialized();
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Failed to register');
  }
}

export async function loginUser(email: string, password: string) {
  await ensureInitialized();
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to login');
  }
}

export async function logoutUser() {
  return signOut(auth);
}

export async function getSavedItems(userId: string): Promise<ClothingItem[]> {
  const itemsRef = collection(db, `users/${userId}/items`);
  const snapshot = await getDocs(itemsRef);
  return snapshot.docs.map(doc => doc.data() as ClothingItem);
}

export async function saveClothingItem(userId: string, itemId: string, item: ClothingItem): Promise<void> {
  const itemRef = doc(db, `users/${userId}/items`, itemId);
  await setDoc(itemRef, item);
}

export async function removeClothingItem(userId: string, itemId: string): Promise<void> {
  const itemRef = doc(db, `users/${userId}/items`, itemId);
  await deleteDoc(itemRef);
}

export async function getClothingItem(itemId: string): Promise<ClothingItem | null> {
  // Query across all users' items to find the specific item
  const itemsRef = collection(db, 'items');
  const q = query(itemsRef, where('id', '==', itemId));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as ClothingItem;
}
function useEffect(effect: () => void | Promise<void>, deps: any[]) {
  // A simple implementation to mimic React's useEffect behavior
  let hasRun = false;

  if (!hasRun) {
    hasRun = true;
    const cleanup = effect();
    if (cleanup instanceof Promise) {
      cleanup.catch(err => console.error('Error in useEffect:', err));
    }
  }
}

