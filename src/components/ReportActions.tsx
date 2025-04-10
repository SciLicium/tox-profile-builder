
import React from "react";
import { Button } from "@/components/ui/button";
import { Substance, ToxicologicalSection } from "../types";
import { generatePDF } from "../utils/pdfGenerator";
import { FilePdf, Save, Share, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReportActionsProps {
  substance: Substance;
  sections: ToxicologicalSection[];
}

const ReportActions: React.FC<ReportActionsProps> = ({ substance, sections }) => {
  const { toast } = useToast();

  const handleGeneratePDF = () => {
    generatePDF(substance, sections);
  };

  const handleSave = () => {
    toast({
      title: "Profil sauvegardé",
      description: `Le profil de ${substance.name} a été ajouté à vos favoris.`,
      duration: 3000,
    });
  };

  const handleShare = () => {
    // Copy a link to this substance to clipboard
    navigator.clipboard.writeText(
      `${window.location.origin}/substance/${substance.id}`
    );
    toast({
      title: "Lien copié",
      description: "Le lien vers ce profil a été copié dans le presse-papiers",
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-end">
      <Button
        variant="outline"
        onClick={handleSave}
        className="flex items-center gap-1"
      >
        <Star className="h-4 w-4" />
        <span>Favoris</span>
      </Button>

      <Button
        variant="outline"
        onClick={handleShare}
        className="flex items-center gap-1"
      >
        <Share className="h-4 w-4" />
        <span>Partager</span>
      </Button>

      <Button
        onClick={handleGeneratePDF}
        className="bg-tox-primary hover:bg-tox-secondary flex items-center gap-1"
      >
        <FilePdf className="h-4 w-4" />
        <span>Générer PDF</span>
      </Button>
    </div>
  );
};

export default ReportActions;
