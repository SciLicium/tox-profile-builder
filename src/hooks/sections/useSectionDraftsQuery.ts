
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SectionDraft } from '@/types';

export const useSectionDraftsQuery = (substanceId?: string) => {
  return useQuery({
    queryKey: ['sectionDrafts', substanceId],
    queryFn: async () => {
      if (!substanceId) return [];
      
      const { data, error } = await supabase
        .from('substance_section_drafts')
        .select('*')
        .eq('substance_id', substanceId)
        .order('section_type');
      
      if (error) throw error;
      
      return data.map(draft => ({
        id: draft.id,
        substanceId: draft.substance_id,
        sectionType: draft.section_type,
        title: draft.title,
        content: draft.content,
        referenceList: draft.reference_list || [],
        sourceUrls: draft.source_urls || [],
        createdAt: draft.created_at,
        updatedAt: draft.updated_at,
      })) as SectionDraft[];
    },
    enabled: !!substanceId,
  });
};
