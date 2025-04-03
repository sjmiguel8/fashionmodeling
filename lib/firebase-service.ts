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
    if (!userId) {
      console.warn('No user ID provided for getSavedItems');
      return [];
    }

    console.log('Attempting to fetch items for user:', userId);
    const savedItemsRef = collection(db, 'users', userId, 'savedItems');

    try {
      const snapshot = await getDocs(savedItemsRef);
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          imageUrl: data.imageUrl || '',
          thumbnailUrl: data.thumbnailUrl || data.imageUrl || '',
          brand: data.brand || '',
          price: Number(data.price) || 0,
          category: data.category || 'other',
          source: data.source || 'google',
          savedAt: data.savedAt || new Date().toISOString()
        } as ClothingItem;
      });

      console.log(`Successfully retrieved ${items.length} items`);
      return items;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in getSavedItems:', error);
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

function categorizeClothing(item: Partial<ClothingItem>): ClothingItem['category'] {
  const titleLower = item.name?.toLowerCase() || '';
  
  // Keywords for each category
  const categories = {
    hats: ['hat', 'cap', 'beanie', 'fedora', 'beret', 'headwear', 'bonnet'],
    tops: ['shirt', 'blouse', 't-shirt', 'top', 'sweater', 'tank'],
    bottoms: ['pants', 'jeans', 'shorts', 'skirt', 'trousers', 'leggings'],
    dresses: ['dress', 'gown', 'frock'],
    outerwear: ['jacket', 'coat', 'hoodie', 'blazer', 'cardigan']
  };

  // Check each category
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => titleLower.includes(keyword))) {
      return category as ClothingItem['category'];
    }
  }

  return 'other';
}

export const saveClothingItem = async (userId: string, item: ClothingItem): Promise<void> => {
  try {
    if (!userId) throw new Error('User ID is required');
    console.log('Attempting to save item for user:', userId);

    const safeId = createSafeDocumentId(item.id);
    const itemRef = doc(db, 'users', userId, 'savedItems', safeId);
    
    const cleanItem = {
      id: safeId,
      name: item.name?.trim() || 'Untitled Item',
      imageUrl: item.imageUrl,
      thumbnailUrl: item.thumbnailUrl || item.imageUrl,
      brand: item.brand?.trim() || 'Unknown',
      price: Number(item.price) || 0,
      category: categorizeClothing(item),
      source: item.source || 'google',
      savedAt: new Date().toISOString(),
      userId
    };

    console.log('Saving item:', cleanItem);
    await setDoc(itemRef, cleanItem);
    console.log('Item saved successfully');
    
  } catch (error) {
    console.error('Error saving item:', error);
    throw error;
  }
};
