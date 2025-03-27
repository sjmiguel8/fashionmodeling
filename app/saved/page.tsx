"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSavedItems, removeClothingItem } from "@/lib/firebase-service"
import type { ClothingItem } from "@/lib/types"

export default function SavedItemsPage() {
  const [savedItems, setSavedItems] = useState<ClothingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, this would come from your auth system
    setUserId("demo-user")
  }, [])

  useEffect(() => {
    if (!userId) return

    const loadSavedItems = async () => {
      setIsLoading(true)
      try {
        const items = await getSavedItems(userId)
        setSavedItems(items)
      } catch (error) {
        console.error("Error loading saved items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedItems()
  }, [userId])

  const handleRemoveItem = async (itemId: string) => {
    if (!userId) return

    try {
      await removeClothingItem(userId, itemId)
      setSavedItems(savedItems.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Items</h1>
          <p className="text-muted-foreground">Your personal collection of saved clothing items.</p>
        </div>
        <Button asChild>
          <Link href="/mannequin">Try On Saved Items</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="tops">Tops</TabsTrigger>
          <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
          <TabsTrigger value="dresses">Dresses</TabsTrigger>
          <TabsTrigger value="outerwear">Outerwear</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-[3/4] bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : savedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {savedItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-[3/4] relative group">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/mannequin?itemId=${item.id}`}>Try On</Link>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <span className="text-xs text-muted-foreground">{item.brand}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No saved items yet</h3>
              <p className="text-muted-foreground mt-1">Start by searching and saving items you like.</p>
              <Button className="mt-4" asChild>
                <Link href="/search">Search Clothing</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="tops" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedItems
              .filter((item) => item.category === "tops")
              .map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-[3/4] relative group">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/mannequin?itemId=${item.id}`}>Try On</Link>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <span className="text-xs text-muted-foreground">{item.brand}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        {/* Similar TabsContent for other categories */}
      </Tabs>
    </div>
  )
}

