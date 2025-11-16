import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProgressQuery } from "@/hooks/queries/useUserProgressQuery";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";

export type WordProgress = {
  word_id: number;
  correct: number;
  attempts: number;
  last_seen: string;
};

export const useUserProgress = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const { 
    progress, 
    isLoading, 
    updateWordProgress: updateProgress, 
    resetProgress: resetProgressMutation 
  } = useUserProgressQuery();

  const loadUserProgress = useCallback(async (): Promise<WordProgress[]> => {
    // With TanStack Query, data is automatically loaded
    // This function now just returns the current state
    return progress;
  }, [progress]);

  const updateWordProgress = useCallback(async (
    wordId: number, 
    isCorrect: boolean
  ) => {
    if (!user) return;

    try {
      updateProgress({ wordId, isCorrect });
    } catch (error: any) {
      console.error('Error updating word progress:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your progress.",
      });
    }
  }, [user, toast, updateProgress]);

  const getCategoryProgress = useCallback(async (
    categoryId: number,
    totalWords: number
  ): Promise<number> => {
    if (!user || totalWords === 0) return 0;

    try {
      // Get words in this category
      const { data: categoryWords, error: wordsError } = await supabase
        .from('words')
        .select('id')
        .eq('category_id', categoryId);

      if (wordsError) throw wordsError;

      const categoryWordIds = new Set(categoryWords?.map(w => w.id) || []);
      
      // Count words with at least one correct answer from current progress
      const masteredWords = progress.filter(
        p => categoryWordIds.has(p.word_id) && p.correct > 0
      ).length;

      return Math.round((masteredWords / totalWords) * 100);
    } catch (error: any) {
      console.error('Error calculating category progress:', error);
      return 0;
    }
  }, [user, progress]);

  const resetProgress = useCallback(async () => {
    if (!user) return;

    try {
      resetProgressMutation();
      
      toast({
        title: "Progress Reset",
        description: "Your learning progress has been reset.",
      });
    } catch (error: any) {
      console.error('Error resetting progress:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset progress.",
      });
    }
  }, [user, toast, resetProgressMutation]);

  return {
    loadUserProgress,
    updateWordProgress,
    getCategoryProgress,
    resetProgress,
    loading: isLoading,
  };
};
