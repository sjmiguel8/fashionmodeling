/**
 * This file contains helper functions for Firebase integration
 * Direct integration with Firebase services for real data
 */

// Import directly from the main firebase service file
import { 
  getSavedItems,
  getClothingItem,
  saveClothingItem, 
  removeClothingItem,
  createSafeDocumentId
} from '../../lib/firebase-service';

/**
 * Re-export the Firebase functions directly
 */
export {
  getSavedItems,
  getClothingItem,
  saveClothingItem,
  removeClothingItem,
  createSafeDocumentId
};
