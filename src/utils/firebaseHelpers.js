/**
 * This file contains helper functions for Firebase integration
 * Direct integration with Firebase services for real data
 */

// Import directly from the main firebase service file
import { 
  getSavedItems as getSavedItemsFromFirebase,
  getClothingItem as getClothingItemFromFirebase, 
  saveClothingItem as saveClothingItemToFirebase,
  removeClothingItem as removeClothingItemFromFirebase,
  createSafeDocumentId
} from '../../lib/firebase-service';

/**
 * Re-export the Firebase functions directly
 */
export const getSavedItems = getSavedItemsFromFirebase;
export const getClothingItem = getClothingItemFromFirebase;
export const saveClothingItem = saveClothingItemToFirebase;
export const removeClothingItem = removeClothingItemFromFirebase;

/**
 * Export the createSafeDocumentId function for convenience
 */
export { createSafeDocumentId };
