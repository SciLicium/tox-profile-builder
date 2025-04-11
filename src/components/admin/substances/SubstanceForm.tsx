
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Beaker, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { substanceSchema, SubstanceFormValues } from './SubstanceFormSchema';
import { Substance } from '@/types';

interface SubstanceFormProps {
  substance?: Substance;
  onSubmit: (data: SubstanceFormValues) => void;
  isSubmitting: boolean;
}

const SubstanceForm: React.FC<SubstanceFormProps> = ({ 
  substance, 
  onSubmit,
  isSubmitting 
}) => {
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
  
  React.useEffect(() => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="h-5 w-5 text-tox-primary" />
          {isEditMode ? "Modifier la substance" : "Ajouter une nouvelle substance"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <FormDescription>
                      Le numéro CAS est un identifiant unique pour les substances chimiques
                    </FormDescription>
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
                    <FormDescription>
                      Notation SMILES pour la structure moléculaire
                    </FormDescription>
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
                      className="min-h-[120px]" 
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
                    <FormDescription>
                      Les brouillons ne sont visibles que par les administrateurs
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
      </CardContent>
    </Card>
  );
};

export default SubstanceForm;
