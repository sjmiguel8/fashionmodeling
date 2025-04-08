import React, { useState, useEffect } from 'react';
import { CLOTHING_CATEGORIES } from '../constants/clothingCategories';
import { getSavedItems } from '../utils/firebaseHelpers';

const SavedItemsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedItems, setSavedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('demo-user'); // This should come from your auth context
  
  useEffect(() => {
    // Load saved items when component mounts
    const loadSavedItems = async () => {
      setIsLoading(true);
      try {
        const items = await getSavedItems(userId);
        console.log(`Loaded ${items.length} saved items in SavedItemsPage`);
        setSavedItems(items);
      } catch (error) {
        console.error('Error loading saved items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedItems();
  }, [userId]);
  
  const handleTryOn = (itemId) => {
    // Navigate to the mannequin page with the selected item
    window.location.href = `/mannequin?itemId=${itemId}`;
  };
  
  const handleSelectItem = (itemId) => {
    setSelectedItems(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };
  
  const handleTryOnSelected = () => {
    // Navigate to mannequin page with all selected items
    const itemIds = Array.from(selectedItems).join(',');
    window.location.href = `/mannequin?items=${itemIds}`;
  };
  
  return (
    <div className="saved-items-page">
      <h1>My Saved Items</h1>
      
      <div className="action-buttons">
        <button 
          className="try-on-selected-btn"
          disabled={selectedItems.size === 0}
          onClick={handleTryOnSelected}
        >
          Try On Selected ({selectedItems.size})
        </button>
      </div>
      
      <div className="category-filters">
        {CLOTHING_CATEGORIES.map((category) => (
          <button 
            key={category.id}
            className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(category.id)}
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
          savedItems
            .filter(item => activeFilter === 'all' || item.category === activeFilter)
            .map(item => (
              <div 
                key={item.id} 
                className={`saved-item-card ${selectedItems.has(item.id) ? 'selected' : ''}`}
              >
                <div className="item-header">
                  <input 
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="item-checkbox"
                  />
                  <h3>{item.name}</h3>
                </div>
                
                <div className="item-image-container">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                
                <div className="item-actions">
                  <button 
                    className="try-on-btn"
                    onClick={() => handleTryOn(item.id)}
                  >
                    Try On
                  </button>
                  <button className="view-details-btn">Details</button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default SavedItemsPage;
