
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ToxSectionType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { SectionDraftFormValues } from '@/components/admin/sections/SectionDraftFormSchema';

export const useSectionMutations = (substanceId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveSectionDraftMutation = useMutation({
    mutationFn: async ({ values, editingId }: { values: SectionDraftFormValues, editingId: string | null }) => {
      if (!substanceId) throw new Error("ID de substance manquant");
      
      const draftData = {
        substance_id: substanceId,
        section_type: values.sectionType as ToxSectionType,
        title: values.title,
        content: values.content || null,
        source_urls: values.sourceUrls,  // Already an array from schema transform
        reference_list: values.referenceList,  // Already an array from schema transform
        updated_at: new Date().toISOString(),
      };
      
      if (editingId) {
        // Update existing draft
        const { data, error } = await supabase
          .from('substance_section_drafts')
          .update(draftData)
          .eq('id', editingId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from('substance_section_drafts')
          .insert([{
            ...draftData,
            created_at: new Date().toISOString(),
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectionDrafts', substanceId] });
    },
  });

  const deleteSectionDraftMutation = useMutation({
    mutationFn: async (draftId: string) => {
      const { error } = await supabase
        .from('substance_section_drafts')
        .delete()
        .eq('id', draftId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectionDrafts', substanceId] });
    },
  });

  return {
    saveSectionDraft: (values: SectionDraftFormValues, editingId: string | null) => {
      return saveSectionDraftMutation.mutateAsync({ values, editingId }, {
        onSuccess: () => {
          toast({
            title: editingId ? "Section mise à jour" : "Section créée",
            description: editingId 
              ? "La section a été mise à jour avec succès" 
              : "La section a été créée avec succès",
          });
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: `Échec de l'opération: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    },
    deleteSectionDraft: (draftId: string) => {
      return deleteSectionDraftMutation.mutateAsync(draftId, {
        onSuccess: () => {
          toast({
            title: "Section supprimée",
            description: "La section a été supprimée avec succès",
          });
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: `Échec de la suppression: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    },
    isSubmitting: saveSectionDraftMutation.isPending
  };
};
