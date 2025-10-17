import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type WordProgress = {
  word_id: number;
  correct: number;
  attempts: number;
  last_seen: string;
};

export const useUserProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const loadUserProgress = useCallback(async (): Promise<WordProgress[]> => {
    if (!user) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error loading user progress:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your progress.",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updateWordProgress = useCallback(async (
    wordId: number, 
    isCorrect: boolean
  ) => {
    if (!user) return;

    try {
      // First, try to get existing progress
      const { data: existing, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('word_id', wordId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        // Update existing progress
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            correct: isCorrect ? existing.correct + 1 : existing.correct,
            attempts: existing.attempts + 1,
            last_seen: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('word_id', wordId);

        if (updateError) throw updateError;
      } else {
        // Insert new progress
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            word_id: wordId,
            correct: isCorrect ? 1 : 0,
            attempts: 1,
            last_seen: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      }
    } catch (error: any) {
      console.error('Error updating word progress:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your progress.",
      });
    }
  }, [user, toast]);

  const getCategoryProgress = useCallback(async (
    categoryId: number,
    totalWords: number
  ): Promise<number> => {
    if (!user || totalWords === 0) return 0;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('word_id, correct, attempts')
        .eq('user_id', user.id);

      if (error) throw error;

      // Get words in this category
      const { data: categoryWords, error: wordsError } = await supabase
        .from('words')
        .select('id')
        .eq('category_id', categoryId);

      if (wordsError) throw wordsError;

      const categoryWordIds = new Set(categoryWords?.map(w => w.id) || []);
      
      // Count words with at least one correct answer
      const masteredWords = data?.filter(
        p => categoryWordIds.has(p.word_id) && p.correct > 0
      ).length || 0;

      return Math.round((masteredWords / totalWords) * 100);
    } catch (error: any) {
      console.error('Error calculating category progress:', error);
      return 0;
    }
  }, [user]);

  const resetProgress = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

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
  }, [user, toast]);

  return {
    loadUserProgress,
    updateWordProgress,
    getCategoryProgress,
    resetProgress,
    loading,
  };
};
