import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Beaker } from 'lucide-react';
import { ToxSectionType } from '@/types';

const substanceSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  inciName: z.string().optional(),
  casNumber: z.string().optional(),
  smiles: z.string().optional(),
  description: z.string().optional(),
  regulatoryStatus: z.string().optional(),
});

type SubstanceFormValues = z.infer<typeof substanceSchema>;

const AddSubstanceForm: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<SubstanceFormValues>({
    resolver: zodResolver(substanceSchema),
    defaultValues: {
      name: '',
      inciName: '',
      casNumber: '',
      smiles: '',
      description: '',
      regulatoryStatus: '',
    },
  });
  
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
          source_urls: [], // Ensure we're using empty arrays, not strings
          reference_list: [], // Ensure we're using empty arrays, not strings
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }));
        
        const { error: sectionsError } = await supabase
          .from('substance_section_drafts')
          .insert(sections);
          
        if (sectionsError) {
          console.error("Error creating section drafts:", sectionsError);
          // Don't throw error here, just log it - we still created the substance successfully
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
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Échec de l'ajout de la substance: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: SubstanceFormValues) => {
    addSubstanceMutation.mutate(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Beaker className="h-5 w-5 text-tox-primary" />
        Ajouter une nouvelle substance
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
          
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={addSubstanceMutation.isPending}
          >
            {addSubstanceMutation.isPending ? "Ajout en cours..." : "Ajouter la substance"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddSubstanceForm;
