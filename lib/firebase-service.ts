import type { ClothingItem } from "./types"

// This is a mock Firebase service that would be replaced with real Firebase in production
const mockDatabase: Record<string, Record<string, ClothingItem>> = {
  "demo-user": {
    "top-1": {
      id: "top-1",
      name: "Classic White T-Shirt",
      brand: "Essentials",
      price: 19.99,
      category: "tops",
      imageUrl: "/placeholder.svg?height=400&width=300&text=T-Shirt",
      color: "white",
      size: "M",
    },
    "bottom-1": {
      id: "bottom-1",
      name: "Slim Fit Jeans",
      brand: "Denim Co",
      price: 59.99,
      category: "bottoms",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Jeans",
      color: "blue",
      size: "32",
    },
    "outerwear-1": {
      id: "outerwear-1",
      name: "Denim Jacket",
      brand: "Denim Co",
      price: 89.99,
      category: "outerwear",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Jacket",
      color: "blue",
      size: "M",
    },
  },
}

export async function getSavedItems(userId: string): Promise<ClothingItem[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Return mock data
  return Object.values(mockDatabase[userId] || {})
}

export async function saveClothingItem(userId: string, itemId: string, item: ClothingItem): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Save to mock database
  if (!mockDatabase[userId]) {
    mockDatabase[userId] = {}
  }

  mockDatabase[userId][itemId] = item
}

export async function removeClothingItem(userId: string, itemId: string): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Remove from mock database
  if (mockDatabase[userId] && mockDatabase[userId][itemId]) {
    delete mockDatabase[userId][itemId]
  }
}

export async function getClothingItem(itemId: string): Promise<ClothingItem | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  for (const userId in mockDatabase) {
    if (mockDatabase.hasOwnProperty(userId)) {
      const userItems = mockDatabase[userId]
      if (userItems.hasOwnProperty(itemId)) {
        return userItems[itemId]
      }
    }
  }

  return null
}

