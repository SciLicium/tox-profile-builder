
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { ToxSectionType, toxSectionTypeLabels, ToxicologicalSection } from "@/types";
import { toxSectionSchema, ToxSectionFormValues } from "./ToxSectionFormSchema";

interface ToxSectionFormProps {
  initialData?: ToxicologicalSection;
  onSubmit: (data: ToxSectionFormValues) => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

const ToxSectionForm: React.FC<ToxSectionFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  isEdit = false
}) => {
  const form = useForm<ToxSectionFormValues>({
    resolver: zodResolver(toxSectionSchema),
    defaultValues: {
      sectionType: initialData?.sectionType as ToxSectionType || ToxSectionType.ACUTE_TOXICITY,
      title: initialData?.title || '',
      content: initialData?.content || '',
      sourceUrls: initialData?.sourceUrls ? initialData.sourceUrls.join('\n') : '',
      referenceList: initialData?.references ? initialData.references.join('\n') : '',
      status: initialData?.status || 'pending',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields */}
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
              <FormLabel>Titre de la section</FormLabel>
              <FormControl>
                <Input placeholder="Titre" {...field} />
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
              <FormLabel>Contenu de la section</FormLabel>
              <FormControl>
                <Textarea placeholder="Contenu" className="min-h-[100px]" {...field} />
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
              <FormLabel>URLs des sources (une par ligne)</FormLabel>
              <FormControl>
                <Textarea placeholder="URL" className="min-h-[80px]" {...field} />
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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut de la section</FormLabel>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="pending" id="pending" />
                  </FormControl>
                  <FormLabel htmlFor="pending">En attente</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="valid" id="valid" />
                  </FormControl>
                  <FormLabel htmlFor="valid">Valide</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="incomplete" id="incomplete" />
                  </FormControl>
                  <FormLabel htmlFor="incomplete">Incomplet</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="verify" id="verify" />
                  </FormControl>
                  <FormLabel htmlFor="verify">A vérifier</FormLabel>
                </FormItem>
              </RadioGroup>
              <FormMessage />
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

export default ToxSectionForm;
