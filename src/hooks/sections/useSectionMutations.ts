
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SectionDraftFormValues } from '@/components/admin/sections/SectionDraftFormSchema';

export const useSectionMutations = (substanceId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Save section draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: { formData: SectionDraftFormValues; sectionId: string | null }) => {
      const { formData, sectionId } = data;
      
      const sectionData = {
        substance_id: substanceId,
        section_type: formData.sectionType,
        title: formData.title,
        content: formData.content || null,
        source_urls: formData.sourceUrls, // Now array from transform
        reference_list: formData.referenceList, // Now array from transform
        updated_at: new Date().toISOString(),
      };
      
      if (sectionId) {
        // Update existing section
        const { data, error } = await supabase
          .from('substance_section_drafts')
          .update(sectionData)
          .eq('id', sectionId)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } else {
        // Create new section
        const { data, error } = await supabase
          .from('substance_section_drafts')
          .insert({
            ...sectionData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectionDrafts', substanceId] });
      toast({
        title: "Section sauvegardée",
        description: "La section a été enregistrée avec succès.",
      });
    },
    onError: (error: any) => {
      console.error('Error saving section draft:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de l'enregistrement de la section: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete section draft mutation
  const deleteDraftMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const { error } = await supabase
        .from('substance_section_drafts')
        .delete()
        .eq('id', sectionId);
        
      if (error) throw error;
      return sectionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectionDrafts', substanceId] });
      toast({
        title: "Section supprimée",
        description: "La section a été supprimée avec succès."
      });
    },
    onError: (error: any) => {
      console.error('Error deleting section draft:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Provide a simplified interface for the consuming components
  return {
    saveSectionDraft: (formData: SectionDraftFormValues, sectionId: string | null) => 
      saveDraftMutation.mutateAsync({ formData, sectionId }),
    deleteSectionDraft: (sectionId: string) => 
      deleteDraftMutation.mutateAsync(sectionId),
    isSubmitting: saveDraftMutation.isPending || deleteDraftMutation.isPending
  };
};
