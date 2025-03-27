import type { ClothingItem } from "./types"

// This is a mock API service that would be replaced with a real API in production
export async function searchClothes(query: string): Promise<ClothingItem[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return [
    {
      id: "top-1",
      name: "Classic White T-Shirt",
      brand: "Essentials",
      price: 19.99,
      category: "tops",
      imageUrl: "/placeholder.svg?height=400&width=300&text=T-Shirt",
      color: "white",
      size: "M",
    },
    {
      id: "top-2",
      name: "Striped Button-Up Shirt",
      brand: "Modern Basics",
      price: 39.99,
      category: "tops",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Shirt",
      color: "blue",
      size: "L",
    },
    {
      id: "bottom-1",
      name: "Slim Fit Jeans",
      brand: "Denim Co",
      price: 59.99,
      category: "bottoms",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Jeans",
      color: "blue",
      size: "32",
    },
    {
      id: "bottom-2",
      name: "Chino Pants",
      brand: "Urban Style",
      price: 49.99,
      category: "bottoms",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Pants",
      color: "khaki",
      size: "30",
    },
    {
      id: "dress-1",
      name: "Floral Summer Dress",
      brand: "Sunshine",
      price: 79.99,
      category: "dresses",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Dress",
      color: "floral",
      size: "S",
    },
    {
      id: "outerwear-1",
      name: "Denim Jacket",
      brand: "Denim Co",
      price: 89.99,
      category: "outerwear",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Jacket",
      color: "blue",
      size: "M",
    },
    {
      id: "top-3",
      name: "V-Neck Sweater",
      brand: "Cozy Knits",
      price: 45.99,
      category: "tops",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Sweater",
      color: "gray",
      size: "M",
    },
    {
      id: "bottom-3",
      name: "Athletic Shorts",
      brand: "Active Gear",
      price: 29.99,
      category: "bottoms",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Shorts",
      color: "black",
      size: "M",
    },
  ].filter(
    (item) =>
      query === "" ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.brand.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()),
  )
}

export async function getClothingItem(id: string): Promise<ClothingItem | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock item
  const items = await searchClothes("")
  return items.find((item) => item.id === id) || null
}

