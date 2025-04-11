
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToxSectionType, toxSectionTypeLabels, ToxicologicalSection } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, FlaskConical } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toxSectionSchema, ToxSectionFormValues } from './ToxSectionFormSchema';

interface ToxSectionFormProps {
  initialData?: ToxicologicalSection;
  onSubmit: (data: ToxSectionFormValues) => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

const ToxSectionForm: React.FC<ToxSectionFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting,
  isEdit
}) => {
  const form = useForm<ToxSectionFormValues>({
    resolver: zodResolver(toxSectionSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      sectionType: initialData?.sectionType as ToxSectionType || ToxSectionType.ACUTE_TOXICITY,
      sourceUrls: Array.isArray(initialData?.sourceUrls) 
        ? initialData.sourceUrls.join('\n') 
        : '',
      referenceList: Array.isArray(initialData?.references) 
        ? initialData.references.join('\n') 
        : '',
      status: initialData?.status || 'pending',
    },
  });

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-tox-primary" />
          {isEdit ? "Modifier la section toxicologique" : "Créer une nouvelle section toxicologique"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sectionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de section*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type de section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(ToxSectionType).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {toxSectionTypeLabels[value] || key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Le type de section détermine où cette information sera affichée
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="valid">Validé</SelectItem>
                        <SelectItem value="incomplete">Incomplet</SelectItem>
                        <SelectItem value="verify">À vérifier</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Indique l'état actuel de validation de cette section
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre*</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de la section" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Contenu détaillé de la section toxicologique..." 
                      className="min-h-[200px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sourceUrls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sources (une par ligne)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="https://exemple.com/source1&#10;https://exemple.com/source2" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Les URLs des sources utilisées pour cette section
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="referenceList"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Références (une par ligne)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Référence 1&#10;Référence 2" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Les références bibliographiques pour cette section
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  "Enregistrement..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? "Mettre à jour" : "Enregistrer"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ToxSectionForm;
