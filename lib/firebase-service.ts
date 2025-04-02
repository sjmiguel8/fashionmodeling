import { auth, db } from './firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, AuthError } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import type { ClothingItem } from "./types"

export function createSafeDocumentId(url: string): string {
  if (!url) return `item_${Date.now()}`
  return encodeURIComponent(url).replace(/[.#$/\[\]]/g, '_');
}

function getAuthErrorMessage(error: AuthError): string {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    default:
      return 'Failed to login. Please try again';
  }
}

export async function loginUser(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    if (!userCredential.user) {
      throw new Error('No user returned from Firebase');
    }
    return userCredential;
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.code) {
      throw new Error(getAuthErrorMessage(error));
    }
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

export const getSavedItems = async (userId: string): Promise<ClothingItem[]> => {
  try {
    const savedItemsRef = collection(db, `users/${userId}/savedItems`);
    const snapshot = await getDocs(savedItemsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClothingItem));
  } catch (error) {
    console.error('Error getting saved items:', error);
    return [];
  }
};

export const getClothingItem = async (itemId: string): Promise<ClothingItem | null> => {
  // Implement your firebase logic here
  // This is a placeholder implementation
  return null;
};

export const removeClothingItem = async (userId: string, itemId: string): Promise<void> => {
  try {
    const itemRef = doc(db, `users/${userId}/savedItems/${itemId}`);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Error removing item:', error);
    throw error;
  }
};

export const saveClothingItem = async (userId: string, item: ClothingItem): Promise<void> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Create a safer ID from the URL
    const safeId = createSafeDocumentId(item.id);
    const itemRef = doc(db, `users/${userId}/savedItems/${safeId}`);
    
    // Clean and validate the data
    const cleanItem = {
      id: safeId,
      name: item.name?.trim() || 'Untitled Item',
      imageUrl: item.imageUrl || '',
      thumbnailUrl: item.thumbnailUrl || item.imageUrl || '',
      brand: item.brand?.trim() || 'Unknown',
      price: Number(item.price) || 0,
      category: item.category || 'tops',
      source: item.source || 'google',
      savedAt: new Date().toISOString(),
      userId // Add user reference
    };

    // Validate required fields
    if (!cleanItem.imageUrl) {
      throw new Error('Image URL is required');
    }

    // Check if already exists
    const existingDoc = await getDoc(itemRef);
    if (!existingDoc.exists()) {
      await setDoc(itemRef, cleanItem);
      console.log('Item saved successfully:', cleanItem);
    } else {
      console.log('Item already exists:', cleanItem);
    }
  } catch (error) {
    console.error('Error saving item:', error);
    throw error;
  }
};
