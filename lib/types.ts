export interface ClothingItem {
  id: string
  name: string
  brand: string
  price: number
  category: "tops" | "bottoms" | "dresses" | "outerwear"
  imageUrl: string
  description?: string
  color?: string
  size?: string
  modelUrl?: string // URL to 3D model for the item
}

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