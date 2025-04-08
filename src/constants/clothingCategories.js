export const CLOTHING_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'tops', name: 'Tops', fitRegion: 'upper' },
  { id: 'bottoms', name: 'Bottoms', fitRegion: 'lower' },
  { id: 'dresses', name: 'Dresses', fitRegion: 'full' },
  { id: 'outerwear', name: 'Outerwear', fitRegion: 'upper' },
  { id: 'activewear', name: 'Activewear' },
  { id: 'swimwear', name: 'Swimwear' },
  { id: 'footwear', name: 'Footwear', fitRegion: 'feet' },
  { id: 'accessories', name: 'Accessories', fitRegion: 'accessory' },
  { id: 'formalwear', name: 'Formalwear' },
  { id: 'lingerie', name: 'Lingerie' }
];

// Subcategories for more specific filtering
export const SUBCATEGORIES = {
  tops: ['T-Shirts', 'Blouses', 'Shirts', 'Sweaters', 'Tank Tops', 'Crop Tops'],
  bottoms: ['Jeans', 'Pants', 'Shorts', 'Skirts', 'Leggings'],
  dresses: ['Casual', 'Formal', 'Mini', 'Maxi', 'Midi'],
  outerwear: ['Jackets', 'Coats', 'Blazers', 'Cardigans'],
  activewear: ['Sports Bras', 'Athletic Tops', 'Athletic Bottoms', 'One-piece'],
  swimwear: ['Bikinis', 'One-piece', 'Cover-ups'],
  footwear: ['Sneakers', 'Boots', 'Heels', 'Flats', 'Sandals'],
  accessories: ['Jewelry', 'Hats', 'Belts', 'Bags', 'Scarves']
};
