
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Substance } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { ArrowLeft, FilePlus } from 'lucide-react';
import SectionDraftCard from './sections/SectionDraftCard';
import SectionDraftForm from './sections/SectionDraftForm';
import EmptySectionState from './sections/EmptySectionState';
import { useSubstanceSections } from '@/hooks/useSubstanceSections';

const SubstanceSections: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    substance,
    sectionDrafts,
    isLoading,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen,
    editingSectionId,
    handleAddSection,
    handleEditSection,
    handleDeleteSection,
    handleSubmit,
    currentEditingSection
  } = useSubstanceSections(id);

  if (isLoading) {
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
      
      {isLoading ? (
        <div className="text-center py-8">Chargement des sections...</div>
      ) : sectionDrafts && sectionDrafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionDrafts.map((section) => (
            <SectionDraftCard 
              key={section.id} 
              section={section} 
              onEdit={handleEditSection} 
              onDelete={handleDeleteSection}
            />
          ))}
        </div>
      ) : (
        <EmptySectionState onAddClick={handleAddSection} />
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
          
          <SectionDraftForm
            initialData={currentEditingSection}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={isSubmitting}
            isEdit={!!editingSectionId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubstanceSections;
