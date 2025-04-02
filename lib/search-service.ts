import type { ClothingItem } from './types'

export async function searchClothingItems(query: string): Promise<ClothingItem[]> {
  if (!query.trim()) {
    return []
  }

  try {
    // Use Promise.allSettled instead of Promise.all to handle partial failures
    const [googleResults] = await Promise.allSettled([
      searchGoogle(query),
    ]);

    const results: ClothingItem[] = [];
    
    // Add successful results from each source
    if (googleResults.status === 'fulfilled') {
      results.push(...googleResults.value);
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

    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      console.error('Google API key or search engine ID is not configured.');
      return [];
    }

    // Add clothing-specific terms and image search parameters
    const searchQuery = `${query} clothing fashion`;
    const apiUrl = `https://www.googleapis.com/customsearch/v1?` +
      new URLSearchParams({
        key: apiKey,
        cx: searchEngineId,
        q: searchQuery,
        searchType: 'image',
        imgSize: 'LARGE',
        imgType: 'photo',
        safe: 'active',
        num: '10'
      });

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.warn('Google search failed:', response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      console.warn('Google search returned non-array:', data);
      return [];
    }

    console.log('Google search returned', data.items.length, 'items');

    return data.items.map((item: any) => ({
      id: item.link || item.sourceUrl,
      name: item.title,
      imageUrl: item.link || item.imageUrl || item.thumbnailUrl || '/placeholder.svg', // Fallback to thumbnail if main image fails
      thumbnailUrl: item.thumbnailLink,
      brand: getSafeDomain(item.link || item.sourceUrl),
      price: 0,
      category: determineCategory(item.title),
      source: 'google'
    }));
  } catch (error) {
    console.warn('Google search error:', error);
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
