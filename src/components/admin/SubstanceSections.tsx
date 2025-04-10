
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Substance, SectionDraft, ToxSectionType, toxSectionTypeLabels } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  ArrowLeft, FileText, FilePlus, Trash2, Edit, Save, FileEdit 
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Form schema for section drafts
const sectionDraftSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  content: z.string().optional(),
  sectionType: z.string(),
  // Fix: Transform input string to string arrays
  sourceUrls: z.string().optional().transform(str => 
    str ? str.split('\n').filter(Boolean) : []
  ),
  referenceList: z.string().optional().transform(str => 
    str ? str.split('\n').filter(Boolean) : []
  ),
});

type SectionDraftFormValues = z.infer<typeof sectionDraftSchema>;

const SubstanceSections: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const form = useForm<SectionDraftFormValues>({
    resolver: zodResolver(sectionDraftSchema),
    defaultValues: {
      title: '',
      content: '',
      sectionType: ToxSectionType.ACUTE_TOXICITY,
      sourceUrls: '',
      referenceList: '',
    },
  });
  
  // Query to fetch substance details
  const { data: substance, isLoading: substanceLoading } = useQuery({
    queryKey: ['substance', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('substances')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Map from DB schema to our interface
      return {
        id: data.id,
        name: data.name,
        inciName: data.inci_name,
        casNumber: data.cas_number,
        smiles: data.smiles,
        description: data.description,
        regulatoryStatus: data.regulatory_status,
        status: data.status || 'published'
      } as Substance;
    },
    enabled: !!id,
  });
  
  // Query to fetch section drafts for this substance
  const { data: sectionDrafts, isLoading: draftsLoading } = useQuery({
    queryKey: ['sectionDrafts', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('substance_section_drafts')
        .select('*')
        .eq('substance_id', id)
        .order('section_type');
      
      if (error) throw error;
      
      return data.map(draft => ({
        id: draft.id,
        substanceId: draft.substance_id,
        sectionType: draft.section_type,
        title: draft.title,
        content: draft.content,
        referenceList: draft.reference_list || [],
        sourceUrls: draft.source_urls || [],
        createdAt: draft.created_at,
        updatedAt: draft.updated_at,
      })) as SectionDraft[];
    },
    enabled: !!id,
  });
  
  // Mutation to create or update a section draft
  const saveSectionDraftMutation = useMutation({
    mutationFn: async (values: SectionDraftFormValues) => {
      if (!id) throw new Error("ID de substance manquant");
      
      // Fix: Cast the sectionType to the proper enum type for database compatibility
      const draftData = {
        substance_id: id,
        section_type: values.sectionType as ToxSectionType,
        title: values.title,
        content: values.content || null,
        source_urls: values.sourceUrls,
        reference_list: values.referenceList,
        updated_at: new Date().toISOString(),
      };
      
      if (editingSectionId) {
        // Update existing draft
        const { data, error } = await supabase
          .from('substance_section_drafts')
          .update(draftData)
          .eq('id', editingSectionId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from('substance_section_drafts')
          .insert([{
            ...draftData,
            created_at: new Date().toISOString(),
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectionDrafts', id] });
      setIsDialogOpen(false);
      setEditingSectionId(null);
      form.reset();
      
      toast({
        title: editingSectionId ? "Section mise à jour" : "Section créée",
        description: editingSectionId 
          ? "La section a été mise à jour avec succès" 
          : "La section a été créée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Échec de l'opération: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Mutation to delete a section draft
  const deleteSectionDraftMutation = useMutation({
    mutationFn: async (draftId: string) => {
      const { error } = await supabase
        .from('substance_section_drafts')
        .delete()
        .eq('id', draftId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectionDrafts', id] });
      toast({
        title: "Section supprimée",
        description: "La section a été supprimée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Échec de la suppression: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handler to edit a section
  const handleEditSection = (section: SectionDraft) => {
    setEditingSectionId(section.id);
    form.reset({
      title: section.title,
      content: section.content || '',
      sectionType: section.sectionType,
      // Fix: Convert array to newline-separated string for form
      sourceUrls: Array.isArray(section.sourceUrls) ? section.sourceUrls.join('\n') : '',
      referenceList: Array.isArray(section.referenceList) ? section.referenceList.join('\n') : '',
    });
    setIsDialogOpen(true);
  };
  
  // Handler to add a new section
  const handleAddSection = () => {
    setEditingSectionId(null);
    form.reset({
      title: '',
      content: '',
      sectionType: ToxSectionType.ACUTE_TOXICITY,
      sourceUrls: '',
      referenceList: '',
    });
    setIsDialogOpen(true);
  };
  
  const onSubmit = (data: SectionDraftFormValues) => {
    saveSectionDraftMutation.mutate(data);
  };
  
  // Handler to delete a section
  const handleDeleteSection = (sectionId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette section ?")) {
      deleteSectionDraftMutation.mutate(sectionId);
    }
  };

  if (substanceLoading) {
    return <div className="flex justify-center items-center h-64">Chargement de la substance...</div>;
  }
  
  if (!substance) {
    return <div className="flex justify-center items-center h-64">Substance non trouvée</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/admin/substances')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour
        </Button>
        <h1 className="text-2xl font-bold">Sections pour {substance.name}</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-gray-500">
            Gérez les sections toxicologiques pour cette substance
          </p>
        </div>
        <Button onClick={handleAddSection}>
          <FilePlus className="h-4 w-4 mr-2" />
          Ajouter une section
        </Button>
      </div>
      
      {draftsLoading ? (
        <div className="text-center py-8">Chargement des sections...</div>
      ) : sectionDrafts && sectionDrafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionDrafts.map((section) => (
            <Card key={section.id} className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-tox-primary" />
                  {section.title}
                </CardTitle>
                <CardDescription>
                  {toxSectionTypeLabels[section.sectionType] || section.sectionType}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      {section.content ? "Voir le contenu" : "Pas de contenu"}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    {section.content ? (
                      <div className="bg-gray-50 p-3 rounded-md text-sm whitespace-pre-wrap">
                        {section.content}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm italic">
                        Cette section n'a pas encore de contenu
                      </div>
                    )}
                    
                    {section.sourceUrls && section.sourceUrls.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-semibold">Sources:</h4>
                        <ul className="text-xs text-gray-600 list-disc ml-4">
                          {section.sourceUrls.map((url, i) => (
                            <li key={i}>{url}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {section.referenceList && section.referenceList.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-semibold">Références:</h4>
                        <ul className="text-xs text-gray-600 list-disc ml-4">
                          {section.referenceList.map((ref, i) => (
                            <li key={i}>{ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditSection(section)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteSection(section.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg border text-center">
          <FileEdit className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-xl font-medium mb-2">Pas encore de sections</h3>
          <p className="text-gray-500 mb-4">
            Commencez par ajouter une section toxicologique pour cette substance.
          </p>
          <Button onClick={handleAddSection}>
            <FilePlus className="h-4 w-4 mr-2" />
            Ajouter une section
          </Button>
        </div>
      )}
      
      {/* Dialog for adding/editing sections */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSectionId ? "Modifier la section" : "Ajouter une section"}
            </DialogTitle>
            <DialogDescription>
              {editingSectionId 
                ? "Modifiez les informations de cette section" 
                : "Ajoutez une nouvelle section toxicologique"}
            </DialogDescription>
          </DialogHeader>
          
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
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  disabled={saveSectionDraftMutation.isPending}
                >
                  {saveSectionDraftMutation.isPending ? (
                    "Enregistrement..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingSectionId ? "Mettre à jour" : "Enregistrer"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubstanceSections;
