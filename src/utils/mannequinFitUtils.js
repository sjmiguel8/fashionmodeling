// Standard measurements as a reference point
const STANDARD_MEASUREMENTS = {
  height: 170, // cm
  bust: 90,    // cm
  waist: 70,   // cm
  hips: 95,    // cm
  inseam: 78,  // cm
  shoulders: 38 // cm
};

/**
 * Calculate scaling factors based on body measurements
 * @param {Object} measurements - User's body measurements
 * @returns {Object} - Scaling factors for different body regions
 */
export const calculateScalingFactors = (measurements) => {
  // Ensure we have valid measurements with fallbacks to standard values
  const safeValues = {
    height: measurements.height || STANDARD_MEASUREMENTS.height,
    bust: measurements.bust || STANDARD_MEASUREMENTS.bust,
    waist: measurements.waist || STANDARD_MEASUREMENTS.waist,
    hips: measurements.hips || STANDARD_MEASUREMENTS.hips,
    inseam: measurements.inseam || STANDARD_MEASUREMENTS.inseam,
    shoulders: measurements.shoulders || STANDARD_MEASUREMENTS.shoulders
  };
  
  return {
    upper: {
      width: safeValues.bust / STANDARD_MEASUREMENTS.bust,
      length: safeValues.height / STANDARD_MEASUREMENTS.height,
      shoulders: safeValues.shoulders / STANDARD_MEASUREMENTS.shoulders
    },
    lower: {
      width: safeValues.hips / STANDARD_MEASUREMENTS.hips,
      length: safeValues.inseam / STANDARD_MEASUREMENTS.inseam,
      waist: safeValues.waist / STANDARD_MEASUREMENTS.waist
    },
    full: {
      width: (safeValues.bust / STANDARD_MEASUREMENTS.bust + 
              safeValues.hips / STANDARD_MEASUREMENTS.hips) / 2,
      length: safeValues.height / STANDARD_MEASUREMENTS.height,
      waist: safeValues.waist / STANDARD_MEASUREMENTS.waist
    },
    feet: {
      // Feet scaling is proportional to height
      size: safeValues.height / STANDARD_MEASUREMENTS.height
    }
  };
};

/**
 * Apply scaling to clothing item based on mannequin measurements
 * @param {Object} clothingItem - The clothing item to fit
 * @param {Object} measurements - Mannequin's measurements
 * @returns {Object} - Transformed clothing item with adjusted styling
 */
export const fitClothingToMannequin = (clothingItem, measurements) => {
  if (!clothingItem) {
    console.error('Invalid clothing item provided to fitClothingToMannequin');
    return clothingItem;
  }

  const scalingFactors = calculateScalingFactors(measurements);
  // Get fit region based on the category
  const fitRegion = getCategoryFitRegion(clothingItem.category);
  
  if (!fitRegion || fitRegion === 'accessory') {
    // Accessories don't need scaling
    return clothingItem;
  }
  
  const scaling = scalingFactors[fitRegion];
  if (!scaling) {
    console.warn(`No scaling factors for region: ${fitRegion}`);
    return clothingItem;
  }
  
  // Clone the clothing item to avoid mutating the original
  const fittedItem = { ...clothingItem };
  
  // Create a default style if none exists
  fittedItem.style = fittedItem.style || {};
  
  // Apply scaling to style properties
  fittedItem.style = {
    ...fittedItem.style,
    width: `calc(${fittedItem.style.width || '100%'} * ${scaling.width || 1})`,
    height: `calc(${fittedItem.style.height || 'auto'} * ${scaling.length || 1})`,
  };
  
  // Additional adjustments based on fit region
  if (fitRegion === 'upper' && scaling.shoulders) {
    fittedItem.style.shoulderWidth = 
      `calc(${fittedItem.style.shoulderWidth || 'auto'} * ${scaling.shoulders})`;
  } else if (fitRegion === 'lower' && scaling.waist) {
    fittedItem.style.waistWidth = 
      `calc(${fittedItem.style.waistWidth || 'auto'} * ${scaling.waist})`;
  }
  
  return fittedItem;
};

/**
 * Get the fit region for a category if not specified
 * @param {string} categoryId 
 * @returns {string} - Fit region
 */
export const getCategoryFitRegion = (categoryId) => {
  const regions = {
    tops: 'upper',
    bottoms: 'lower',
    dresses: 'full',
    outerwear: 'upper',
    footwear: 'feet',
    accessories: 'accessory',
    activewear: 'full',
    swimwear: 'full',
    formalwear: 'full',
    lingerie: 'full'
  };
  
  return regions[categoryId] || null;
};

/**
 * Parse URL parameters to get selected item IDs
 * @param {string} url - The current URL
 * @returns {Array} - Array of item IDs to be displayed
 */
export const getSelectedItemsFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const itemParam = urlObj.searchParams.get('itemId');
    const itemsParam = urlObj.searchParams.get('items');
    
    if (itemParam) {
      return [itemParam];
    } else if (itemsParam) {
      return itemsParam.split(',');
    }
    return [];
  } catch (e) {
    console.error('Error parsing URL parameters:', e);
    return [];
  }
};
