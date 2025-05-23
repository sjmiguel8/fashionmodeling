export type ClothingItem = {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl?: string; // Add thumbnail support
  brand: string;
  price: number;
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'hats' | 'other';
  source?: 'google' | 'pinterest';
  savedAt?: string;
};

export interface WebResult {
  title: string;
  link: string;
  snippet: string;
}

export interface PinterestPin {
  title: string;
  image_url: string;
  link: string;
}