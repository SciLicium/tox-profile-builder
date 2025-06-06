
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ToxSectionType } from '@/types';
import SubstanceForm from './substances/SubstanceForm';
import { SubstanceFormValues } from './substances/SubstanceFormSchema';
import { useAuth } from '@/contexts/AuthContext';

const AddSubstanceForm: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();
  
  const addSubstanceMutation = useMutation({
    mutationFn: async (data: SubstanceFormValues) => {
      if (!user?.id || !profile) {
        throw new Error('User not authenticated or profile not loaded');
      }
      
      console.log("Creating substance with user ID:", user.id);
      
      // First, insert the substance
      const { error, data: newSubstance } = await supabase
        .from('substances')
        .insert([{
          name: data.name,
          inci_name: data.inciName || null,
          cas_number: data.casNumber || null,
          smiles: data.smiles || null,
          description: data.description || null,
          regulatory_status: data.regulatoryStatus || null,
          status: data.isDraft ? 'draft' : 'published',
          created_by: user.id,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        }])
        .select('*')
        .single();
      
      if (error) {
        console.error("Error creating substance:", error);
        throw error;
      }
      
      // Then create default section drafts for the substance
      if (newSubstance?.id) {
        const sections = Object.values(ToxSectionType).map(sectionType => ({
          substance_id: newSubstance.id,
          section_type: sectionType,
          title: `${data.name} - ${sectionType.replace(/_/g, ' ').toLowerCase()}`,
          content: '',
          source_urls: [], 
          reference_list: [],
          created_by: user.id,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }));
        
        const { error: sectionsError } = await supabase
          .from('substance_section_drafts')
          .insert(sections);
          
        if (sectionsError) {
          console.error("Error creating section drafts:", sectionsError);
        }
      }
      
      return newSubstance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['substances'] });
      toast({
        title: "Substance ajoutée",
        description: "La substance et ses sections toxicologiques ont été ajoutées avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Échec de l'ajout de la substance: ${error.message}`,
        variant: "destructive",
      });
      console.error("Complete error details:", error);
    },
  });
  
  const handleSubmit = (data: SubstanceFormValues) => {
    addSubstanceMutation.mutate(data);
  };

  return (
    <SubstanceForm 
      onSubmit={handleSubmit} 
      isSubmitting={addSubstanceMutation.isPending} 
    />
  );
};

export default AddSubstanceForm;
