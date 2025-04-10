
import React from "react";
import { Substance, ToxicologicalSection } from "../types";
import ToxSection from "./ToxSection";
import ReportActions from "./ReportActions";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubstanceProfileProps {
  substance: Substance;
  sections: ToxicologicalSection[];
  onBack: () => void;
}

const SubstanceProfile: React.FC<SubstanceProfileProps> = ({
  substance,
  sections,
  onBack,
}) => {
  const sortedSections = [...sections].sort(
    (a, b) => a.sectionType - b.sectionType
  );

  // Helper function to get status counts
  const getStatusCounts = () => {
    const counts = {
      valid: 0,
      incomplete: 0,
      verify: 0,
      pending: 0,
    };

    sections.forEach((section) => {
      counts[section.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div>
      <div className="flex items-center mb-2">
        <Button
          variant="outline"
          size="sm"
          className="mr-3"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour
        </Button>
        <h1 className="text-2xl font-bold">{substance.name}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nom INCI</p>
            <p className="font-medium">{substance.inciName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Numéro CAS</p>
            <p className="font-medium">{substance.casNumber}</p>
          </div>
          {substance.smiles && (
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-gray-500">Structure SMILES</p>
              <p className="font-mono text-sm bg-gray-50 p-2 rounded border">{substance.smiles}</p>
            </div>
          )}
          {substance.description && (
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p>{substance.description}</p>
            </div>
          )}
          {substance.regulatoryStatus && (
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-gray-500">Statut réglementaire</p>
              <Badge 
                variant="outline" 
                className="mt-1 bg-teal-50 text-teal-600 hover:bg-teal-50"
              >
                {substance.regulatoryStatus}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="tox-status-valid">{statusCounts.valid} sections validées</div>
        {statusCounts.incomplete > 0 && (
          <div className="tox-status-incomplete">{statusCounts.incomplete} sections incomplètes</div>
        )}
        {statusCounts.verify > 0 && (
          <div className="tox-status-verify">{statusCounts.verify} sections à vérifier</div>
        )}
        {statusCounts.pending > 0 && (
          <div className="tox-status-pending">{statusCounts.pending} sections en attente</div>
        )}
      </div>

      <ReportActions substance={substance} sections={sections} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {sortedSections.map((section) => (
          <ToxSection key={section.id} section={section} />
        ))}
      </div>
      
      <div className="mt-8">
        <ReportActions substance={substance} sections={sections} />
      </div>
    </div>
  );
};

export default SubstanceProfile;
