import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export async function fetchMedicalTerms() {
  const { data, error } = await supabase
    .from('words')
    .select(`
      id,
      en,
      he,
      rus,
      category_id,
      categories (
        id,
        slug,
        name_he,
        name_en,
        name_ru
      )
    `)
    .order('id');

  if (error) throw new Error(error.message);

  return (data || []).map(word => {
    const category = Array.isArray(word.categories) ? word.categories[0] : word.categories;
    return {
      ...word,
      category
    };
  });
}

export function useMedicalTerms() {
  return useQuery({
    queryKey: ["medicalTerms"],
    queryFn: fetchMedicalTerms,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
