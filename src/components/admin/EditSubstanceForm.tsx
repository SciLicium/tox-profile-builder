
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Substance } from '@/types';
import { SubstanceForm } from './substances/SubstanceForm';
import { SubstanceFormValues } from './substances/SubstanceFormSchema';

interface EditSubstanceFormProps {
  substance?: Substance;
  onSuccess?: (updatedSubstance: Substance) => void;
}

const EditSubstanceForm: React.FC<EditSubstanceFormProps> = ({ substance, onSuccess }) => {
  const { toast } = useToast();
  const isEditMode = !!substance;
  
  const updateSubstanceMutation = useMutation({
    mutationFn: async (data: SubstanceFormValues) => {
      const subData = {
        name: data.name,
        inci_name: data.inciName || null,
        cas_number: data.casNumber || null,
        smiles: data.smiles || null,
        description: data.description || null,
        regulatory_status: data.regulatoryStatus || null,
        status: data.isDraft ? 'draft' : 'published',
        updated_at: new Date().toISOString(),
      };
      
      if (isEditMode && substance) {
        const { data: updatedSubstance, error } = await supabase
          .from('substances')
          .update(subData)
          .eq('id', substance.id)
          .select()
          .single();
        
        if (error) throw error;
        return updatedSubstance;
      } else {
        const { data: newSubstance, error } = await supabase
          .from('substances')
          .insert([subData])
          .select()
          .single();
        
        if (error) throw error;
        return newSubstance;
      }
    },
    onSuccess: (data) => {
      toast({
        title: isEditMode ? "Substance mise à jour" : "Substance ajoutée",
        description: isEditMode 
          ? "La substance a été mise à jour avec succès" 
          : "La substance a été ajoutée avec succès",
      });
      
      if (onSuccess) {
        onSuccess(data as unknown as Substance);
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Échec de l'opération: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (data: SubstanceFormValues) => {
    updateSubstanceMutation.mutate(data);
  };

  return (
    <SubstanceForm
      substance={substance}
      onSubmit={handleSubmit}
      isSubmitting={updateSubstanceMutation.isPending}
    />
  );
};

export default EditSubstanceForm;
