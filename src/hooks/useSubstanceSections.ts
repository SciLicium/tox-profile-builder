
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Substance, SectionDraft, ToxSectionType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { SectionDraftFormValues } from '@/components/admin/sections/SectionDraftFormSchema';

export const useSubstanceSections = (id?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  // Query to fetch substance details
  const { data: substance, isLoading: substanceLoading } = useQuery({
    queryKey: ['substance', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('substances')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Map from DB schema to our interface
      return {
        id: data.id,
        name: data.name,
        inciName: data.inci_name,
        casNumber: data.cas_number,
        smiles: data.smiles,
        description: data.description,
        regulatoryStatus: data.regulatory_status,
        status: data.status || 'published'
      } as Substance;
    },
    enabled: !!id,
  });
  
  // Query to fetch section drafts for this substance
  const { data: sectionDrafts, isLoading: draftsLoading } = useQuery({
    queryKey: ['sectionDrafts', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('substance_section_drafts')
        .select('*')
        .eq('substance_id', id)
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
    enabled: !!id,
  });
  
  // Mutation to create or update a section draft
  const saveSectionDraftMutation = useMutation({
    mutationFn: async (values: SectionDraftFormValues) => {
      if (!id) throw new Error("ID de substance manquant");
      
      // Cast the sectionType to the proper enum type for database compatibility
      const draftData = {
        substance_id: id,
        section_type: values.sectionType as ToxSectionType,
        title: values.title,
        content: values.content || null,
        source_urls: values.sourceUrls as string[],
        reference_list: values.referenceList as string[],
        updated_at: new Date().toISOString(),
      };
      
      if (editingSectionId) {
        // Update existing draft
        const { data, error } = await supabase
          .from('substance_section_drafts')
          .update(draftData)
          .eq('id', editingSectionId)
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
      queryClient.invalidateQueries({ queryKey: ['sectionDrafts', id] });
      setIsDialogOpen(false);
      setEditingSectionId(null);
      
      toast({
        title: editingSectionId ? "Section mise à jour" : "Section créée",
        description: editingSectionId 
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
    },
  });
  
  // Mutation to delete a section draft
  const deleteSectionDraftMutation = useMutation({
    mutationFn: async (draftId: string) => {
      const { error } = await supabase
        .from('substance_section_drafts')
        .delete()
        .eq('id', draftId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectionDrafts', id] });
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
    },
  });

  // Handler to edit a section
  const handleEditSection = (section: SectionDraft) => {
    setEditingSectionId(section.id);
    setIsDialogOpen(true);
  };
  
  // Handler to add a new section
  const handleAddSection = () => {
    setEditingSectionId(null);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = (data: SectionDraftFormValues) => {
    saveSectionDraftMutation.mutate(data);
  };
  
  // Handler to delete a section
  const handleDeleteSection = (sectionId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette section ?")) {
      deleteSectionDraftMutation.mutate(sectionId);
    }
  };

  return {
    substance,
    sectionDrafts,
    isLoading: substanceLoading || draftsLoading,
    isSubmitting: saveSectionDraftMutation.isPending,
    isDialogOpen,
    setIsDialogOpen,
    editingSectionId,
    handleAddSection,
    handleEditSection,
    handleDeleteSection,
    handleSubmit,
    currentEditingSection: editingSectionId && sectionDrafts 
      ? sectionDrafts.find(section => section.id === editingSectionId)
      : undefined
  };
};
