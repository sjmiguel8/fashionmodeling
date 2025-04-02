"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, Eye, ExternalLink, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { getSavedItems, removeClothingItem } from "@/lib/firebase-service"
import { toast } from "@/components/ui/use-toast"
import type { ClothingItem } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export default function SavedItemsPage() {
  const [savedItems, setSavedItems] = useState<ClothingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date')
  const [activeCategory, setActiveCategory] = useState('all')

  const sortedAndFilteredItems = savedItems
    .filter(item => activeCategory === 'all' || item.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return (b.savedAt ? new Date(b.savedAt).getTime() : 0) - 
               (a.savedAt ? new Date(a.savedAt).getTime() : 0)
      }
      return a.name.localeCompare(b.name)
    })

  useEffect(() => {
    if (!user) {
      setSavedItems([])
      setIsLoading(false)
      return
    }

    const loadSavedItems = async () => {
      setIsLoading(true)
      try {
        const items = await getSavedItems(user.uid)
        // Sort items by most recently saved
        const sortedItems = items.sort((a, b) => {
          const dateA = a.savedAt ? new Date(a.savedAt).getTime() : 0
          const dateB = b.savedAt ? new Date(b.savedAt).getTime() : 0
          return dateB - dateA
        })
        setSavedItems(sortedItems)
      } catch (error) {
        console.error("Error loading saved items:", error)
        toast({
          title: "Error",
          description: "Failed to load saved items.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedItems()
  }, [user])

  const handleRemoveItem = async (itemId: string) => {
    if (!user) return

    try {
      await removeClothingItem(user.uid, itemId)
      setSavedItems(prev => prev.filter(item => item.id !== itemId))
      toast({
        title: "Item removed",
        description: "The item has been removed from your collection.",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="container px-4 py-16 mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
        <p className="text-muted-foreground mb-8">Please sign in to view your saved items.</p>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    )
  }

  // Add categories
  const categories = [
    { value: 'all', label: 'All', icon: Filter },
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' }
  ]

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Saved Items</h1>
            <p className="text-muted-foreground">
              {savedItems.length} items in your collection
            </p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Sort by {sortBy === 'date' ? 'Date' : 'Name'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('date')}>
                  Date Saved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  Name
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild>
              <Link href="/mannequin">Try Items On</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.value} 
                  value={category.value}
                  className="relative"
                >
                  {category.label}
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({savedItems.filter(i => category.value === 'all' || i.category === category.value).length})
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.value} value={category.value}>
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
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {sortedAndFilteredItems
                    .filter(item => category.value === 'all' || item.category === category.value)
                    .map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group"
                      >
                        <Card className="overflow-hidden">
                          <div className="aspect-[3/4] relative">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button variant="secondary" size="sm" asChild>
                                <Link href={`/mannequin?itemId=${item.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Try On
                                </Link>
                              </Button>
                              <Button variant="secondary" size="sm" asChild>
                                <a href={item.source} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View Source
                                </a>
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium line-clamp-1 flex-1">{item.name}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive -mr-2"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                            {item.savedAt && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Saved {new Date(item.savedAt).toLocaleDateString()}
                              </p>
                            )}
                          </CardContent>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

