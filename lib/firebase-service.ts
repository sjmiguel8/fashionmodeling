import { auth, db } from './firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, AuthError } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import type { ClothingItem } from "./types"

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
  // Implement your firebase logic here
  // This is a placeholder implementation
  return [];
};

export const getClothingItem = async (itemId: string): Promise<ClothingItem | null> => {
  // Implement your firebase logic here
  // This is a placeholder implementation
  return null;
};

export const removeClothingItem = async (userId: string, itemId: string): Promise<void> => {
  // Implement your firebase logic here
};

export const saveClothingItem = async (userId: string, item: ClothingItem): Promise<void> => {
  // Implement your firebase logic here
};
