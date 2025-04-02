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
    console.log('Starting Google search for query:', query);

    if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
      console.error('Google API key or search engine ID is not configured.');
      return [];
    }

    const response = await fetch(`/api/web-search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.warn('Google search failed:', response.statusText);
      return [];
    }
    
    const items = await response.json();
    if (!Array.isArray(items)) {
      console.warn('Google search returned non-array:', items);
      return [];
    }
    
    console.log('Google search returned', items.length, 'items');

    return items.map((item: any) => ({
      id: item.sourceUrl || item.link,
      name: item.title,
      imageUrl: item.imageUrl || item.thumbnailUrl || '/placeholder.svg', // Fallback to thumbnail if main image fails
      thumbnailUrl: item.thumbnailUrl,
      brand: getSafeDomain(item.sourceUrl || item.link),
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
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '';
    const response = await fetch(`${baseUrl}/api/pinterest-search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.warn('Pinterest search failed:', response.statusText);
      return [];
    }
    
    const data = await response.json();
    const items = data.items || [];
    
    return items.map((item: any) => ({
      id: item.id,
      name: item.title || 'Pinterest Item',
      imageUrl: item.image?.original?.url || item.images?.['736x']?.url || '/placeholder.svg',
      thumbnailUrl: item.images?.['236x']?.url,
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

function getSafeDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    console.warn('Invalid URL:', url);
    return 'Unknown';
  }
}

function determineCategory(title: string): 'tops' | 'bottoms' | 'dresses' | 'outerwear' {
  title = title.toLowerCase();

  if (title.includes('dress')) {
    return 'dresses';
  } else if (title.includes('skirt') || title.includes('pants') || title.includes('jeans') || title.includes('leggings') || title.includes('shorts')) {
    return 'bottoms';
  } else if (title.includes('jacket') || title.includes('coat') || title.includes('blazer')) {
    return 'outerwear';
  } else {
    return 'tops';
  }
}
