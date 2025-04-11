import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToxSectionType, toxSectionTypeLabels, SectionDraft } from "@/types";
import { sectionDraftSchema, SectionDraftFormValues } from "./SectionDraftFormSchema";

interface SectionDraftFormProps {
  initialData?: SectionDraft;
  onSubmit: (data: SectionDraftFormValues) => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

const SectionDraftForm: React.FC<SectionDraftFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  isEdit = false
}) => {
  const form = useForm<SectionDraftFormValues>({
    resolver: zodResolver(sectionDraftSchema),
    defaultValues: {
      sectionType: initialData?.sectionType || ToxSectionType.ACUTE_TOXICITY,
      title: initialData?.title || '',
      content: initialData?.content || '',
      sourceUrls: initialData?.sourceUrls ? initialData.sourceUrls.join('\n') : '',
      referenceList: initialData?.referenceList ? initialData.referenceList.join('\n') : '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="sectionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de section</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(toxSectionTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key as ToxSectionType}>
                      {label}
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
              <FormLabel>Titre</FormLabel>
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
                <Textarea placeholder="Contenu de la section" className="min-h-[100px]" {...field} />
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
              <FormLabel>URLs sources (une par ligne)</FormLabel>
              <FormControl>
                <Textarea placeholder="URL source" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Entrez chaque URL sur une nouvelle ligne.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referenceList"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Liste de références (une par ligne)</FormLabel>
              <FormControl>
                <Textarea placeholder="Référence" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Entrez chaque référence sur une nouvelle ligne.
              </FormDescription>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Enregistrement..."
              : isEdit
                ? "Mettre à jour"
                : "Enregistrer"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SectionDraftForm;
