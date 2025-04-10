
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileEdit, FilePlus } from 'lucide-react';

interface EmptySectionStateProps {
  onAddClick: () => void;
}

const EmptySectionState: React.FC<EmptySectionStateProps> = ({ onAddClick }) => {
  return (
    <div className="bg-white p-8 rounded-lg border text-center">
      <FileEdit className="h-12 w-12 mx-auto text-gray-400 mb-3" />
      <h3 className="text-xl font-medium mb-2">Pas encore de sections</h3>
      <p className="text-gray-500 mb-4">
        Commencez par ajouter une section toxicologique pour cette substance.
      </p>
      <Button onClick={onAddClick}>
        <FilePlus className="h-4 w-4 mr-2" />
        Ajouter une section
      </Button>
    </div>
  );
};

export default EmptySectionState;
