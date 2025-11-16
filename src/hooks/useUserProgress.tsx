import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProgressQuery } from "@/hooks/queries/useUserProgressQuery";
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

  // No change — progress is already cached
  const loadUserProgress = useCallback(async () => progress, [progress]);

  const updateWordProgress = useCallback(async (wordId: number, isCorrect: boolean) => {
    if (!user) return;

    try {
      // Only update progress - avoid invalidating all queries
      await updateProgress({ wordId, isCorrect }); 
    } catch (error) {
      console.error("Error updating word progress:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your progress.",
      });
    }
  }, [user, toast, updateProgress]);

  /**
   * ⛔ NO MORE SUPABASE CALL HERE ⛔
   * We use words that are already fetched in Learning.tsx
   */
  const getAllCategoryProgress = useCallback(
    async (
      words: { id: number; category_id: number | null }[],
      categories: { id: number; totalWords: number }[]
    ): Promise<Record<number, number>> => {
      if (!user) return {};

      const progressMap: Record<number, number> = {};

      for (const category of categories) {
        const idsInCategory = new Set(
          words
            .filter(w => w.category_id === category.id)
            .map(w => w.id)
        );

        const masteredCount = progress.filter(
          p => idsInCategory.has(p.word_id) && p.correct > 0
        ).length;

        progressMap[category.id] = Math.round((masteredCount / category.totalWords) * 100);
      }

      return progressMap;
    },
    [user, progress]
  );

  const resetProgress = useCallback(async () => {
    if (!user) return;

    try {
      await resetProgressMutation();

      toast({
        title: "Progress Reset",
        description: "Your learning progress has been reset.",
      });
    } catch (error: any) {
      console.error("Error resetting progress:", error);
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
    getAllCategoryProgress,
    resetProgress,
    loading: isLoading,
  };
};
