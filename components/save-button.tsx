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
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      getUserSavedItemIds(userId).then(savedIds => {
        setIsSaved(savedIds.has(createSafeDocumentId(item.id)));
      });
    }
  }, [userId, item.id]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      toast({ title: "Please sign in to save items" });
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await removeClothingItem(userId, createSafeDocumentId(item.id));
      } else {
        await saveClothingItem(userId, item);
      }
      setIsSaved(!isSaved);
      onSaveChange?.(!isSaved);
    } catch (error) {
      toast({ title: "Error saving item" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className={`${isSaved ? 'text-red-500' : 'text-gray-500'} ${isLoading ? 'opacity-50' : ''}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      <Heart className={isSaved ? "fill-current" : ""} />
    </Button>
  );
}
