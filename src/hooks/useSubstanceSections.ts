
import { useState } from 'react';
import { SectionDraft } from '@/types';
import { SectionDraftFormValues } from '@/components/admin/sections/SectionDraftFormSchema';
import { useSubstanceQuery } from './substance/useSubstanceQuery';
import { useSectionDraftsQuery } from './sections/useSectionDraftsQuery';
import { useSectionMutations } from './sections/useSectionMutations';

export const useSubstanceSections = (id?: string) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  // Use our separated query hooks
  const { data: substance, isLoading: substanceLoading } = useSubstanceQuery(id);
  const { data: sectionDrafts, isLoading: draftsLoading } = useSectionDraftsQuery(id);
  
  // Use our mutations hook
  const { saveSectionDraft, deleteSectionDraft, isSubmitting } = useSectionMutations(id);

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
    saveSectionDraft(data, editingSectionId)
      .then(() => {
        setIsDialogOpen(false);
        setEditingSectionId(null);
      });
  };
  
  // Handler to delete a section
  const handleDeleteSection = (sectionId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette section ?")) {
      deleteSectionDraft(sectionId);
    }
  };

  return {
    substance,
    sectionDrafts,
    isLoading: substanceLoading || draftsLoading,
    isSubmitting,
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
