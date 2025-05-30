"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { 
  saveClothingItem, 
  removeClothingItem, 
  getSavedItems, 
  createSafeDocumentId 
} from "@/lib/firebase-service";
import type { ClothingItem } from "@/lib/types";
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import styles from './search.module.css';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ClothingItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (user) {
      const loadSavedItems = async () => {
        const items = await getSavedItems(user.uid)
        setSavedItemIds(new Set(items.map(item => createSafeDocumentId(item.id))))
      }
      loadSavedItems()
    } else {
      setSavedItemIds(new Set())
    }
  }, [user])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/clothing-search?query=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error(`Search API failed: ${response.status}`)
      }
      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching clothes:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveItem = async (item: ClothingItem) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save items to your collection.",
        variant: "destructive",
      })
      return
    }

    const safeId = createSafeDocumentId(item.id)
    const isSaved = savedItemIds.has(safeId)

    try {
      console.log('Item being saved:', item); // Add this line

      if (isSaved) {
        await removeClothingItem(user.uid, safeId)
        setSavedItemIds(prev => {
          const next = new Set(prev)
          next.delete(safeId)
          console.log('Item removed, updated savedItemIds:', next); // Add this line
          return next
        })
        toast({
          title: "Item removed",
          description: `${item.name} has been removed from your collection.`,
        })
      } else {
        await saveClothingItem(user.uid, {
          ...item,
          savedAt: new Date().toISOString()
        })
        setSavedItemIds(prev => {
          const next = new Set(prev).add(safeId)
          console.log('Item saved, updated savedItemIds:', next); // Add this line
          return next
        })
        toast({
          title: "Item saved!",
          description: `${item.name} has been saved to your collection.`,
        })
      }
    } catch (error) {
      console.error("Error saving/removing item:", error)
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.target as HTMLImageElement;
    img.src = '/placeholder.svg';
    img.onerror = null; // Prevent infinite loop if placeholder also fails
  };

  const renderClothingCard = (item: ClothingItem) => {
    const safeId = createSafeDocumentId(item.id);
    const isSaved = savedItemIds.has(safeId);

    return (
      <Card key={item.id} className="overflow-hidden">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform hover:scale-110"
            onError={handleImageError}
          />
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
            className={`h-8 w-8 ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleSaveItem(item)}
            disabled={!user}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isSaved
                  ? 'fill-red-500 text-red-500'
                  : user
                    ? 'fill-transparent hover:fill-red-500 hover:text-red-500'
                    : 'text-gray-400'
              }`}
            />
            <span className="sr-only">
              {isSaved ? 'Remove from saved' : 'Save'}
            </span>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Clothing</h1>
          <p className="text-muted-foreground">Find and save clothing items to try on later.</p>
        </div>
        <div className="w-full md:w-auto">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Search for clothing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            />
            <Button type="submit" onClick={() => handleSearch(searchQuery)}>
              Search
            </Button>
          </div>
        </div>
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
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-[3/4] bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((item) => renderClothingCard(item))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="tops" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults
              .filter((item) => item.category === "tops")
              .map((item) => renderClothingCard(item))}
          </div>
        </TabsContent>
        {/* Similar TabsContent for other categories */}
      </Tabs>
    </div>
  )
}

