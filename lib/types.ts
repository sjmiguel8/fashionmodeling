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

