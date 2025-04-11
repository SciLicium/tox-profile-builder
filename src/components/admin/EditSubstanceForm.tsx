
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Substance } from '@/types';
import SubstanceForm from './substances/SubstanceForm';
import { SubstanceFormValues } from './substances/SubstanceFormSchema';
import { useAuth } from '@/contexts/AuthContext';

interface EditSubstanceFormProps {
  substance?: Substance;
  onSuccess?: (updatedSubstance: Substance) => void;
}

const EditSubstanceForm: React.FC<EditSubstanceFormProps> = ({ substance, onSuccess }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();
  const isEditMode = !!substance;
  
  const updateSubstanceMutation = useMutation({
    mutationFn: async (data: SubstanceFormValues) => {
      if (!user?.id || !profile) {
        throw new Error('User not authenticated or profile not loaded');
      }
      
      if (isEditMode && substance) {
        console.log("Updating substance with ID:", substance.id);
        const { data: updatedSubstance, error } = await supabase
          .from('substances')
          .update({
            name: data.name,
            inci_name: data.inciName || null,
            cas_number: data.casNumber || null,
            smiles: data.smiles || null,
            description: data.description || null,
            regulatory_status: data.regulatoryStatus || null,
            status: data.isDraft ? 'draft' : 'published',
            updated_by: user.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', substance.id)
          .select('*')
          .single();
        
        if (error) {
          console.error("Error updating substance:", error);
          throw error;
        }
        return updatedSubstance;
      } else {
        console.log("Creating new substance with user ID:", user.id);
        const { data: newSubstance, error } = await supabase
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
        return newSubstance;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['substances'] });
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
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Échec de l'opération: ${error.message}`,
        variant: "destructive",
      });
      console.error("Complete error details:", error);
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
