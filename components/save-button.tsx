"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { ClothingItem } from "@/lib/types";
import { getUserSavedItemIds, saveClothingItem, removeClothingItem, createSafeDocumentId } from "@/lib/firebase-service";

interface SaveButtonProps {
  item: ClothingItem;
  userId?: string | null;
  onSaveChange?: (isSaved: boolean) => void;
}

export function SaveButton({ item, userId, onSaveChange }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    async function initAndCheck() {
      if (!userId) return;
      
      try {
        const savedIds = await getUserSavedItemIds(userId);
        if (mounted) {
          const safeId = createSafeDocumentId(item.id);
          setIsSaved(savedIds.has(safeId));
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    }

    initAndCheck();
    
    return () => {
      mounted = false;
    };
  }, [userId, item.id]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      toast({ title: "Please sign in to save items" });
      return;
    }

    setIsLoading(true);
    try {
      const safeId = createSafeDocumentId(item.id);
      if (isSaved) {
        await removeClothingItem(userId, safeId);
        setIsSaved(false);
      } else {
        await saveClothingItem(userId, item);
        setIsSaved(true);
      }
      onSaveChange?.(!isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({ 
        title: "Error",
        description: "Failed to update saved status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className={`${isSaved ? 'text-red-500' : 'text-gray-500'} ${isLoading || !isInitialized ? 'opacity-50' : ''}`}
      onClick={handleClick}
      disabled={isLoading || !isInitialized}
    >
      <Heart className={isSaved ? "fill-current" : ""} />
    </Button>
  );
}
