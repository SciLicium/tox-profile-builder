
import React from 'react';
import { SectionDraft, toxSectionTypeLabels } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { FileText, Edit, Trash2 } from 'lucide-react';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SectionDraftCardProps {
  section: SectionDraft;
  onEdit: (section: SectionDraft) => void;
  onDelete: (sectionId: string) => void;
}

const SectionDraftCard: React.FC<SectionDraftCardProps> = ({ 
  section, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card className="mb-4">
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
          onClick={() => onEdit(section)}
        >
          <Edit className="h-4 w-4 mr-1" /> Modifier
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(section.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SectionDraftCard;
