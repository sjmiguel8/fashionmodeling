"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { MannequinViewer } from "@/components/mannequin-viewer"
import { SavedItemsList } from "@/components/saved-items-list"
import { getSavedItems, getClothingItem, createSafeDocumentId } from "@/lib/firebase-service"
import type { ClothingItem } from "@/lib/types"

export default function MannequinPage() {
  const searchParams = useSearchParams()
  const itemId = searchParams.get("itemId")

  const [savedItems, setSavedItems] = useState<ClothingItem[]>([])
  const [selectedItems, setSelectedItems] = useState<{
    top: ClothingItem | null
    bottom: ClothingItem | null
    dress: ClothingItem | null
    outerwear: ClothingItem | null
  }>({
    top: null,
    bottom: null,
    dress: null,
    outerwear: null,
  })
  const [bodyShape, setBodyShape] = useState({
    height: 50,
    shoulders: 50,
    chest: 50,
    waist: 50,
    hips: 50,
  })
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

        // If an item ID was provided in the URL, select it
        if (itemId) {
          const item = await getClothingItem(itemId)
          if (item) {
            selectItemByCategory(item)
          }
        }
      } catch (error) {
        console.error("Error loading saved items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedItems()
  }, [userId, itemId])

  const selectItemByCategory = (item: ClothingItem) => {
    setSelectedItems((prev) => {
      if (item.category === "tops") {
        return { ...prev, top: item }
      } else if (item.category === "bottoms") {
        return { ...prev, bottom: item }
      } else if (item.category === "dresses") {
        return { ...prev, dress: item }
      } else if (item.category === "outerwear") {
        return { ...prev, outerwear: item }
      }
      return prev
    })
  }

  const handleSelectItem = (item: ClothingItem) => {
    selectItemByCategory(item)
  }

  const handleClearOutfit = () => {
    setSelectedItems({
      top: null,
      bottom: null,
      dress: null,
      outerwear: null,
    })
  }

  const handleBodyShapeChange = (key: keyof typeof bodyShape, value: number) => {
    setBodyShape((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Virtual Try-On</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="aspect-[4/5] w-full bg-muted/30 relative">
              <MannequinViewer 
                bodyShape={bodyShape} 
                selectedItems={selectedItems}
                savedItems={savedItems} // Pass savedItems to MannequinViewer
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Body Shape</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm">Height</label>
                  <span className="text-sm text-muted-foreground">{bodyShape.height}%</span>
                </div>
                <Slider
                  value={[bodyShape.height]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleBodyShapeChange("height", value[0])}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm">Shoulders</label>
                  <span className="text-sm text-muted-foreground">{bodyShape.shoulders}%</span>
                </div>
                <Slider
                  value={[bodyShape.shoulders]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleBodyShapeChange("shoulders", value[0])}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm">Chest</label>
                  <span className="text-sm text-muted-foreground">{bodyShape.chest}%</span>
                </div>
                <Slider
                  value={[bodyShape.chest]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleBodyShapeChange("chest", value[0])}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm">Waist</label>
                  <span className="text-sm text-muted-foreground">{bodyShape.waist}%</span>
                </div>
                <Slider
                  value={[bodyShape.waist]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleBodyShapeChange("waist", value[0])}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm">Hips</label>
                  <span className="text-sm text-muted-foreground">{bodyShape.hips}%</span>
                </div>
                <Slider
                  value={[bodyShape.hips]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleBodyShapeChange("hips", value[0])}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-4">Selected Outfit</h3>
            <div className="space-y-3">
              {selectedItems.top && (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                    <img
                      src={selectedItems.top.imageUrl || "/placeholder.svg"}
                      alt={selectedItems.top.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedItems.top.name}</p>
                    <p className="text-xs text-muted-foreground">Top</p>
                  </div>
                </div>
              )}

              {selectedItems.bottom && (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                    <img
                      src={selectedItems.bottom.imageUrl || "/placeholder.svg"}
                      alt={selectedItems.bottom.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedItems.bottom.name}</p>
                    <p className="text-xs text-muted-foreground">Bottom</p>
                  </div>
                </div>
              )}

              {selectedItems.dress && (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                    <img
                      src={selectedItems.dress.imageUrl || "/placeholder.svg"}
                      alt={selectedItems.dress.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedItems.dress.name}</p>
                    <p className="text-xs text-muted-foreground">Dress</p>
                  </div>
                </div>
              )}

              {selectedItems.outerwear && (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                    <img
                      src={selectedItems.outerwear.imageUrl || "/placeholder.svg"}
                      alt={selectedItems.outerwear.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedItems.outerwear.name}</p>
                    <p className="text-xs text-muted-foreground">Outerwear</p>
                  </div>
                </div>
              )}

              {!selectedItems.top && !selectedItems.bottom && !selectedItems.dress && !selectedItems.outerwear && (
                <p className="text-sm text-muted-foreground">No items selected</p>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={handleClearOutfit}
                disabled={
                  !selectedItems.top && !selectedItems.bottom && !selectedItems.dress && !selectedItems.outerwear
                }
              >
                Clear Outfit
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Saved Items</h2>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tops">Tops</TabsTrigger>
            <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
            <TabsTrigger value="dresses">Dresses</TabsTrigger>
            <TabsTrigger value="outerwear">Outerwear</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <SavedItemsList items={savedItems} onSelectItem={handleSelectItem} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="tops" className="mt-4">
            <SavedItemsList
              items={savedItems.filter((item) => item.category === "tops")}
              onSelectItem={handleSelectItem}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="bottoms" className="mt-4">
            <SavedItemsList
              items={savedItems.filter((item) => item.category === "bottoms")}
              onSelectItem={handleSelectItem}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="dresses" className="mt-4">
            <SavedItemsList
              items={savedItems.filter((item) => item.category === "dresses")}
              onSelectItem={handleSelectItem}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="outerwear" className="mt-4">
            <SavedItemsList
              items={savedItems.filter((item) => item.category === "outerwear")}
              onSelectItem={handleSelectItem}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

