
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionDraft, ToxSectionType, toxSectionTypeLabels } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter
} from "@/components/ui/dialog";
import { sectionDraftSchema, SectionDraftFormValues } from './SectionDraftFormSchema';

interface SectionDraftFormProps {
  initialData?: SectionDraft;
  onSubmit: (data: SectionDraftFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

const SectionDraftForm: React.FC<SectionDraftFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting,
  isEdit
}) => {
  const form = useForm<SectionDraftFormValues>({
    resolver: zodResolver(sectionDraftSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      content: initialData.content || '',
      sectionType: initialData.sectionType as ToxSectionType,
      sourceUrls: Array.isArray(initialData.sourceUrls) 
        ? initialData.sourceUrls.join('\n') 
        : '',
      referenceList: Array.isArray(initialData.referenceList) 
        ? initialData.referenceList.join('\n') 
        : '',
    } : {
      title: '',
      content: '',
      sectionType: ToxSectionType.ACUTE_TOXICITY,
      sourceUrls: '',
      referenceList: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="sectionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de section</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />
        
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
              <FormLabel>Contenu</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Contenu de la section..." 
                  className="min-h-[150px]" 
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
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
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
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
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
        </DialogFooter>
      </form>
    </Form>
  );
};

export default SectionDraftForm;
