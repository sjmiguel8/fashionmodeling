/**
 * This file contains helper functions for Firebase integration
 * Integration with the actual Firebase services from /lib/firebase-service.ts
 */

import { getSavedItems as getFBSavedItems, 
         getClothingItem as getFBClothingItem,
         saveClothingItem as saveFBClothingItem,
         removeClothingItem as removeFBClothingItem } from '../../lib/firebase-service';

/**
 * Fetch saved items for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Array of saved clothing items
 */
export const getSavedItems = async (userId) => {
  try {
    // Call the actual Firebase service
    const items = await getFBSavedItems(userId);
    console.log(`Retrieved ${items.length} items for user ${userId}`);
    return items;
  } catch (error) {
    console.error('Error in getSavedItems:', error);
    return [];
  }
};

/**
 * Get a specific clothing item by ID
 * @param {string} userId - The user ID
 * @param {string} itemId - The item ID
 * @returns {Promise<Object|null>} - The clothing item or null if not found
 */
export const getClothingItem = async (userId, itemId) => {
  try {
    // For now, we'll get all items and find the one we need
    // Later this could be optimized to use the direct getClothingItem method
    const items = await getSavedItems(userId);
    return items.find(item => item.id === itemId) || null;
  } catch (error) {
    console.error('Error in getClothingItem:', error);
    return null;
  }
};

/**
 * Save a clothing item for a user
 * @param {string} userId - The user ID
 * @param {Object} item - The clothing item to save
 * @returns {Promise<Object>} - The saved item
 */
export const saveClothingItem = async (userId, item) => {
  try {
    // Call the actual Firebase service
    return await saveFBClothingItem(userId, item);
  } catch (error) {
    console.error('Error in saveClothingItem:', error);
    throw error;
  }
};

/**
 * Remove a clothing item for a user
 * @param {string} userId - The user ID
 * @param {string} itemId - The item ID to remove
 * @returns {Promise<void>}
 */
export const removeClothingItem = async (userId, itemId) => {
  try {
    // Call the actual Firebase service
    await removeFBClothingItem(userId, itemId);
  } catch (error) {
    console.error('Error in removeClothingItem:', error);
    throw error;
  }
};
