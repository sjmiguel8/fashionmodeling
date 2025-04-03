"use client"

import { Button } from "@/components/ui/button"
import type { ClothingItem } from "@/lib/types"
import { useEffect, useState } from "react";

interface SavedItemsListProps {
  items: ClothingItem[]
  onSelectItem: (item: ClothingItem) => void
  isLoading: boolean
}

export function SavedItemsList({ items, onSelectItem, isLoading }: SavedItemsListProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Preload images to prevent WebGL texture issues
    items.forEach(item => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(item.imageUrl));
      };
      img.src = item.imageUrl;
    });
  }, [items]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No saved items found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <div key={item.id} className="group cursor-pointer" onClick={() => onSelectItem(item)}>
          <div className="aspect-[3/4] rounded-md overflow-hidden relative">
            {loadedImages.has(item.imageUrl) ? (
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-muted animate-pulse" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="sm" variant="secondary">
                Try On
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

