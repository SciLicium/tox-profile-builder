
import React, { useState } from 'react';
import ToxSectionForm from './ToxSectionForm';
import { ToxSectionFormValues } from './ToxSectionFormSchema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { FilePlus, FlaskConical } from 'lucide-react';
import { Substance, ToxicologicalSection } from '@/types';

interface ToxSectionManagerProps {
  substanceId: string;
  substanceName: string;
  initialSections?: ToxicologicalSection[];
}

const ToxSectionManager: React.FC<ToxSectionManagerProps> = ({ 
  substanceId,
  substanceName,
  initialSections = []
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<ToxicologicalSection | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const saveToxSectionMutation = useMutation({
    mutationFn: async (data: ToxSectionFormValues & { sectionId?: string }) => {
      const { sectionId, ...formData } = data;
      
      const sectionData = {
        substance_id: substanceId,
        section_type: formData.sectionType,
        title: formData.title,
        content: formData.content,
        source_urls: formData.sourceUrls,
        reference_list: formData.referenceList,
        status: formData.status,
        updated_at: new Date().toISOString(),
      };
      
      if (sectionId) {
        // Update existing section
        const { data, error } = await supabase
          .from('toxicological_sections')
          .update(sectionData)
          .eq('id', sectionId)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } else {
        // Create new section
        const { data, error } = await supabase
          .from('toxicological_sections')
          .insert({
            ...sectionData,
            acquisition_date: new Date().toISOString(),
            created_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toxicologicalSections', substanceId] });
      toast({
        title: editingSection ? "Section mise à jour" : "Section créée",
        description: "La section toxicologique a été enregistrée avec succès.",
      });
      setIsDialogOpen(false);
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de l'enregistrement de la section: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const handleAddSection = () => {
    setEditingSection(null);
    setIsDialogOpen(true);
  };
  
  const handleEditSection = (section: ToxicologicalSection) => {
    setEditingSection(section);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = (data: ToxSectionFormValues) => {
    saveToxSectionMutation.mutate({
      ...data,
      sectionId: editingSection?.id
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-tox-primary" />
          Sections toxicologiques pour {substanceName}
        </h2>
        
        <Button onClick={handleAddSection}>
          <FilePlus className="h-4 w-4 mr-2" />
          Ajouter une section
        </Button>
      </div>
      
      {/* List existing sections here if needed */}
      
      {/* Dialog for adding/editing sections */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "Modifier la section" : "Ajouter une section"}
            </DialogTitle>
            <DialogDescription>
              {editingSection 
                ? "Modifiez les informations toxicologiques de cette section" 
                : "Ajoutez une nouvelle section toxicologique"}
            </DialogDescription>
          </DialogHeader>
          
          <ToxSectionForm
            initialData={editingSection || undefined}
            onSubmit={handleSubmit}
            isSubmitting={saveToxSectionMutation.isPending}
            isEdit={!!editingSection}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ToxSectionManager;
