import React, { useState, useEffect } from 'react';
import { CLOTHING_CATEGORIES } from '../constants/clothingCategories';
import { fitClothingToMannequin, getSelectedItemsFromUrl } from '../utils/mannequinFitUtils';
// Import directly from the firebase-service instead of through the helper
import { getSavedItems } from '../../lib/firebase-service';  

const MannequinPage = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [mannequinMeasurements, setMannequinMeasurements] = useState({
    height: 170,
    bust: 90,
    waist: 70,
    hips: 95,
    inseam: 78,
    shoulders: 38
  });
  const [wornItems, setWornItems] = useState({});
  const [selectedOutfit, setSelectedOutfit] = useState({
    tops: null,
    bottoms: null,
    dresses: null,
    outerwear: null,
    accessories: null,
    footwear: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Use a hard-coded user ID for now (should come from auth context in real app)
  const userId = 'demo-user'; 

  // Load saved items and check URL parameters
  useEffect(() => {
    const loadSavedItemsAndCheckParams = async () => {
      setIsLoading(true);
      setErrorMessage('');
      
      try {
        // Direct debugging to find the issue
        console.log('Fetching saved items from Firebase...');
        
        // Use a specific user ID that has saved items (from your main app)
        // This should match the user ID used in your main app to save items
        const actualUserId = user?.uid || 'demo-user';
        console.log('Using user ID for fetch:', actualUserId);
        
        // Store response in a variable to inspect it
        const response = await getSavedItems(actualUserId);
        console.log('Raw response from getSavedItems:', response);
        
        // Explicitly check if the response exists and is an array
        if (!response || !Array.isArray(response)) {
          console.error('Invalid response from getSavedItems:', response);
          setErrorMessage('Failed to load saved items (invalid data format).');
          setSavedItems([]);
          return;
        }
        
        // If we have items, log them and update state
        console.log(`Retrieved ${response.length} items:`, response);
        
        // Set the state with the response
        setSavedItems(response);
        
        // Check URL params after ensuring we have items
        const currentUrl = window.location.href;
        const selectedItemIds = getSelectedItemsFromUrl(currentUrl);
        
        if (selectedItemIds.length > 0) {
          console.log('Found item IDs in URL:', selectedItemIds);
          selectedItemIds.forEach(itemId => {
            const item = response.find(i => i.id === itemId);
            if (item) {
              console.log('Found matching item to try on:', item);
              tryOnClothing(item);
            } else {
              console.warn(`Item with ID ${itemId} not found in saved items`);
            }
          });
        }
      } catch (error) {
        console.error('Error in loadSavedItemsAndCheckParams:', error);
        setErrorMessage(`Failed to load saved items: ${error.message}`);
        setSavedItems([]);
      } finally {
        setIsLoading(false);
        
        // Add a timeout to check the state after the update should be processed
        setTimeout(() => {
          console.log('Checking savedItems state after update cycle:', savedItems);
        }, 100);
      }
    };
    
    loadSavedItemsAndCheckParams();
  }, [userId]);
  
  // Function to try on clothing
  const tryOnClothing = (item) => {
    if (!item) {
      console.error('Invalid item to try on (null or undefined)');
      return;
    }
    
    if (!item.category) {
      console.error('Item has no category:', item);
      return;
    }
    
    // Get the category key - could be a string or an object with id
    const categoryKey = typeof item.category === 'string' ? item.category : item.category.id;
    
    console.log(`Trying on item: ${item.name} in category: ${categoryKey}`);
    
    // Update the selected outfit state
    setSelectedOutfit(prevOutfit => ({
      ...prevOutfit,
      [categoryKey]: item
    }));
    
    // Fit the clothing to the mannequin's measurements
    const fittedItem = fitClothingToMannequin(item, mannequinMeasurements);
    setWornItems(prevWornItems => ({
      ...prevWornItems,
      [categoryKey]: fittedItem
    }));
    
    // Provide user feedback
    console.log(`Added ${item.name} to mannequin in category ${categoryKey}`);
  };
  
  // Update mannequin measurements
  const updateMeasurements = (newMeasurements) => {
    setMannequinMeasurements(prevMeasurements => ({
      ...prevMeasurements,
      ...newMeasurements
    }));
    
    // Refit any currently worn items with new measurements
    const updatedWornItems = {};
    Object.keys(wornItems).forEach(categoryId => {
      if (wornItems[categoryId]) {
        updatedWornItems[categoryId] = 
          fitClothingToMannequin(wornItems[categoryId], {
            ...mannequinMeasurements,
            ...newMeasurements
          });
      }
    });
    
    setWornItems(updatedWornItems);
  };
  
  // Clear a specific item from the outfit
  const removeOutfitItem = (categoryId) => {
    setSelectedOutfit(prevOutfit => ({
      ...prevOutfit,
      [categoryId]: null
    }));
    
    setWornItems(prevWornItems => {
      const updatedItems = {...prevWornItems};
      delete updatedItems[categoryId];
      return updatedItems;
    });
  };
  
  // Clear all items from the outfit
  const clearOutfit = () => {
    setSelectedOutfit({
      tops: null,
      bottoms: null,
      dresses: null,
      outerwear: null,
      accessories: null,
      footwear: null
    });
    setWornItems({});
  };
  
  // Log state before render to debug
  console.log('Rendering with savedItems:', savedItems);

  return (
    <div className="mannequin-page">
      {/* Main container */}
      <div className="mannequin-container">
        {/* Left section - 3D Mannequin */}
        <div className="mannequin-display">
          <h2>Virtual Try-On</h2>
          
          {/* Mannequin figure */}
          <div className="mannequin-figure">
            {isLoading ? (
              <div className="loading-indicator">Loading...</div>
            ) : (
              /* Render fitted clothing items on mannequin */
              Object.values(wornItems).map(item => (
                <div 
                  key={item.id} 
                  className={`clothing-item ${item.category}`}
                  style={item.style}
                >
                  <img src={item.imageUrl} alt={item.name} />
                </div>
              ))
            )}
          </div>
          
          {/* Measurement controls */}
          <div className="measurement-controls">
            <h3>Adjust Measurements</h3>
            {/* Height slider */}
            <label>
              Height: {mannequinMeasurements.height} cm
              <input 
                type="range" 
                min="150" 
                max="190" 
                value={mannequinMeasurements.height}
                onChange={(e) => updateMeasurements({ height: parseInt(e.target.value) })}
              />
            </label>
            
            <label>
              Bust: {mannequinMeasurements.bust} cm
              <input 
                type="range" 
                min="70" 
                max="120" 
                value={mannequinMeasurements.bust}
                onChange={(e) => updateMeasurements({ bust: parseInt(e.target.value) })}
              />
            </label>
            
            <label>
              Waist: {mannequinMeasurements.waist} cm
              <input 
                type="range" 
                min="60" 
                max="110" 
                value={mannequinMeasurements.waist}
                onChange={(e) => updateMeasurements({ waist: parseInt(e.target.value) })}
              />
            </label>
            
            <label>
              Hips: {mannequinMeasurements.hips} cm
              <input 
                type="range" 
                min="70" 
                max="130" 
                value={mannequinMeasurements.hips}
                onChange={(e) => updateMeasurements({ hips: parseInt(e.target.value) })}
              />
            </label>
          </div>
        </div>
        
        {/* Right section - Selected Outfit */}
        <div className="selected-outfit">
          <h3>Selected Outfit</h3>
          
          <div className="selected-items-list">
            {/* Display selected items or a message if none */}
            {Object.entries(selectedOutfit).some(([_, item]) => item) ? (
              <div className="outfit-items">
                {Object.entries(selectedOutfit).map(([category, item]) => {
                  if (!item) return null;
                  
                  return (
                    <div key={category} className="outfit-item">
                      <div className="item-thumbnail">
                        <img src={item.imageUrl} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-category">{category}</p>
                      </div>
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeOutfitItem(category)}
                        aria-label={`Remove ${item.name}`}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
                
                <button 
                  className="clear-outfit-btn"
                  onClick={clearOutfit}
                >
                  Clear All
                </button>
              </div>
            ) : (
              <p className="no-items-message">No items selected. Choose items from below.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Saved items section with category filters */}
      <div className="saved-items-section">
        <h3>My Saved Items ({savedItems.length})</h3>
        
        {/* Debug info */}
        <div className="debug-info">
          Items loaded: {savedItems.length} | 
          Loading state: {isLoading ? 'Loading...' : 'Completed'} |
          Error: {errorMessage || 'None'}
        </div>
        
        <div className="category-filters">
          {CLOTHING_CATEGORIES.map((category) => (
            <button 
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
              {/* Show count of items in each category */}
              <span className="item-count">
                {savedItems.filter(item => item.category === category.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Update the saved items grid section with more explicit conditions */}
        <div className="saved-items-grid">
          {isLoading ? (
            <div className="loading-message">Loading your saved items...</div>
          ) : errorMessage ? (
            <div className="error-message">{errorMessage}</div>
          ) : savedItems.length === 0 ? (
            <div className="no-items-message">No saved items found. Save some items first!</div>
          ) : (
            <div>
              <div className="saved-items-grid">
                {savedItems
                  .filter(item => activeCategory === 'all' || item.category === activeCategory)
                  .map(item => {
                    const categoryId = item.category;
                    const isSelected = selectedOutfit[categoryId] && 
                                      selectedOutfit[categoryId].id === item.id;
                    
                    console.log(`Rendering item: ${item.id} - ${item.name} (${item.category})`);
                    
                    return (
                      <div key={item.id} className={`saved-item-card ${isSelected ? 'selected' : ''}`}>
                        <div className="item-image-container">
                          <img src={item.imageUrl} alt={item.name} />
                        </div>
                        <h4>{item.name}</h4>
                        <p className="item-category">{item.category}</p>
                        <button 
                          className="try-on-btn"
                          onClick={() => tryOnClothing(item)}
                          disabled={isSelected}
                        >
                          {isSelected ? 'Currently Worn' : 'Try On'}
                        </button>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MannequinPage;