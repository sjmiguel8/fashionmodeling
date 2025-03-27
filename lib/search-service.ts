import type { ClothingItem } from './types'

export async function searchClothingItems(query: string): Promise<ClothingItem[]> {
  if (!query.trim()) {
    return []
  }

  try {
    // Use Promise.allSettled instead of Promise.all to handle partial failures
    const [googleResults, pinterestResults] = await Promise.allSettled([
      searchGoogle(query),
      searchPinterest(query)
    ]);

    const results: ClothingItem[] = [];
    
    // Add successful results from each source
    if (googleResults.status === 'fulfilled') {
      results.push(...googleResults.value);
    }
    if (pinterestResults.status === 'fulfilled') {
      results.push(...pinterestResults.value);
    }

    return results;
  } catch (error) {
    console.error('Error searching clothing items:', error);
    return [];
  }
}

async function searchGoogle(query: string): Promise<ClothingItem[]> {
  try {
    const response = await fetch(`/api/web-search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.warn('Google search failed:', response.statusText);
      return [];
    }
    
    const items = await response.json();
    if (!Array.isArray(items)) {
      return [];
    }
    
    return items.map((item: any) => ({
      id: item.sourceUrl || item.link,
      name: item.title,
      imageUrl: item.imageUrl || item.link, // Use the direct image URL
      thumbnailUrl: item.thumbnailUrl,
      brand: new URL(item.sourceUrl || item.link).hostname.replace('www.', ''),
      price: 0,
      category: determineCategory(item.title),
      source: 'google'
    }));
  } catch (error) {
    console.warn('Google search error:', error);
    return [];
  }
}

async function searchPinterest(query: string): Promise<ClothingItem[]> {
  try {
    const response = await fetch(`/api/pinterest-search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.warn('Pinterest search failed:', response.statusText);
      return [];
    }
    
    const items = await response.json();
    if (!Array.isArray(items)) {
      return [];
    }
    
    return items.map((item: any) => ({
      id: item.id || `pin-${Date.now()}`,
      name: item.title || 'Pinterest Item',
      imageUrl: item.image?.original?.url || '/placeholder.svg',
      brand: 'Pinterest',
      price: 0,
      category: determineCategory(item.title || ''),
      source: 'pinterest'
    }));
  } catch (error) {
    console.warn('Pinterest search error:', error);
    return [];
  }
}

function determineCategory(title: string): 'tops' | 'bottoms' | 'dresses' | 'outerwear' {
  const lowercase = title.toLowerCase();
  if (lowercase.includes('dress')) return 'dresses';
  if (lowercase.includes('jacket') || lowercase.includes('coat')) return 'outerwear';
  if (lowercase.includes('pants') || lowercase.includes('shorts') || lowercase.includes('skirt')) return 'bottoms';
  return 'tops';
}
