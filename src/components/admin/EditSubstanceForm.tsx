
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Beaker, Save } from 'lucide-react';
import { Substance } from '@/types';

const substanceSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  inciName: z.string().optional(),
  casNumber: z.string().optional(),
  smiles: z.string().optional(),
  description: z.string().optional(),
  regulatoryStatus: z.string().optional(),
  isDraft: z.boolean().default(false),
});

type SubstanceFormValues = z.infer<typeof substanceSchema>;

interface EditSubstanceFormProps {
  substance?: Substance;
  onSuccess?: (updatedSubstance: Substance) => void;
}

const EditSubstanceForm: React.FC<EditSubstanceFormProps> = ({ substance, onSuccess }) => {
  const { toast } = useToast();
  const isEditMode = !!substance;
  
  const form = useForm<SubstanceFormValues>({
    resolver: zodResolver(substanceSchema),
    defaultValues: {
      name: substance?.name || '',
      inciName: substance?.inciName || '',
      casNumber: substance?.casNumber || '',
      smiles: substance?.smiles || '',
      description: substance?.description || '',
      regulatoryStatus: substance?.regulatoryStatus || '',
      isDraft: substance?.status === 'draft',
    },
  });
  
  useEffect(() => {
    if (substance) {
      form.reset({
        name: substance.name,
        inciName: substance.inciName || '',
        casNumber: substance.casNumber || '',
        smiles: substance.smiles || '',
        description: substance.description || '',
        regulatoryStatus: substance.regulatoryStatus || '',
        isDraft: substance.status === 'draft',
      });
    }
  }, [substance, form]);

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
      
      if (!isEditMode) {
        form.reset();
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
  
  const onSubmit = (data: SubstanceFormValues) => {
    updateSubstanceMutation.mutate(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Beaker className="h-5 w-5 text-tox-primary" />
        {isEditMode ? "Modifier la substance" : "Ajouter une nouvelle substance"}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la substance*</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Acide glycolique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="inciName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom INCI</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Glycolic Acid" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="casNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro CAS</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 79-14-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="smiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMILES</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: C(C(=O)O)O" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="regulatoryStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut réglementaire</FormLabel>
                <FormControl>
                  <Input placeholder="ex: Autorisé dans les cosmétiques (EU)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Description de la substance..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isDraft"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Sauvegarder comme brouillon
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Les brouillons ne sont visibles que par les administrateurs
                  </p>
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={updateSubstanceMutation.isPending}
          >
            {updateSubstanceMutation.isPending ? (
              <>Enregistrement en cours...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? "Mettre à jour" : "Enregistrer"}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditSubstanceForm;
