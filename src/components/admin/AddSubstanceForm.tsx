
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ToxSectionType } from '@/types';
import SubstanceForm from './substances/SubstanceForm';
import { SubstanceFormValues } from './substances/SubstanceFormSchema';

const AddSubstanceForm: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const addSubstanceMutation = useMutation({
    mutationFn: async (data: SubstanceFormValues) => {
      // First, insert the substance
      const { error, data: newSubstance } = await supabase
        .from('substances')
        .insert([{
          name: data.name,
          inci_name: data.inciName,
          cas_number: data.casNumber,
          smiles: data.smiles,
          description: data.description,
          regulatory_status: data.regulatoryStatus,
          status: data.isDraft ? 'draft' : 'published',
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Then create default section drafts for the substance
      if (newSubstance?.id) {
        const sections = Object.values(ToxSectionType).map(sectionType => ({
          substance_id: newSubstance.id,
          section_type: sectionType,
          title: `${data.name} - ${sectionType}`,
          content: '',
          source_urls: [], 
          reference_list: [],
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
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Échec de l'ajout de la substance: ${error.message}`,
        variant: "destructive",
      });
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
