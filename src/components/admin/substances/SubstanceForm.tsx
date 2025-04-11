
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Beaker, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { substanceSchema, SubstanceFormValues } from './SubstanceFormSchema';
import { Substance } from '@/types';
import { SubstanceBasicInfo } from './form/SubstanceBasicInfo';
import { SubstanceIdentifiers } from './form/SubstanceIdentifiers';
import { SubstanceDetails } from './form/SubstanceDetails';

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
            <SubstanceBasicInfo />
            <SubstanceIdentifiers />
            <SubstanceDetails />
            
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
