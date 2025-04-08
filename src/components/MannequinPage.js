import React, { useState, useEffect } from 'react';
import { CLOTHING_CATEGORIES } from '../constants/clothingCategories';
import { fitClothingToMannequin, getSelectedItemsFromUrl } from '../utils/mannequinFitUtils';
import { getSavedItems, getClothingItem } from '../utils/firebaseHelpers';

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
  const [userId, setUserId] = useState('demo-user'); // This should come from your auth context

  // Load saved items and check URL parameters
  useEffect(() => {
    const loadSavedItemsAndCheckParams = async () => {
      setIsLoading(true);
      try {
        // Get all saved items from your actual firebase service
        const items = await getSavedItems(userId);
        setSavedItems(items);
        console.log(`Retrieved ${items.length} items for the mannequin page`);
        
        // Check for item IDs in URL
        const currentUrl = window.location.href;
        const selectedItemIds = getSelectedItemsFromUrl(currentUrl);
        
        if (selectedItemIds.length > 0) {
          console.log('Found item IDs in URL:', selectedItemIds);
          
          // Process each item ID
          for (const itemId of selectedItemIds) {
            const item = items.find(i => i.id === itemId);
            if (item) {
              console.log('Found item to try on:', item);
              tryOnClothing(item);
            }
          }
        }
      } catch (error) {
        console.error('Error loading saved items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedItemsAndCheckParams();
  }, [userId]);
  
  // Function to try on clothing
  const tryOnClothing = (item) => {
    if (!item || !item.category) {
      console.error('Invalid item to try on:', item);
      return;
    }
    
    const categoryKey = typeof item.category === 'string' ? item.category : item.category.id;
    
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
                  className={`clothing-item ${item.category.id || item.category}`}
                  style={item.style}
                >
                  <img src={item.imageUrl || item.image} alt={item.name} />
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
                        <img src={item.imageUrl || item.image} alt={item.name} />
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
        <div className="category-filters">
          {CLOTHING_CATEGORIES.map((category) => (
            <button 
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="saved-items-grid">
          {isLoading ? (
            <div className="loading-message">Loading your saved items...</div>
          ) : savedItems.length === 0 ? (
            <div className="no-items-message">No saved items found. Save some items first!</div>
          ) : (
            /* Filter and display saved items */
            savedItems
              .filter(item => activeCategory === 'all' || item.category === activeCategory)
              .map(item => {
                const categoryId = item.category;
                const isSelected = selectedOutfit[categoryId] && 
                                  selectedOutfit[categoryId].id === item.id;
                return (
                  <div key={item.id} className={`saved-item-card ${isSelected ? 'selected' : ''}`}>
                    <div className="item-image-container">
                      <img src={item.imageUrl} alt={item.name} />
                    </div>
                    <h4>{item.name}</h4>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MannequinPage;