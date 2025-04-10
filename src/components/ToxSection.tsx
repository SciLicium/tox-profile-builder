
import React from "react";
import { ToxicologicalSection } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, ExternalLink, Calendar } from "lucide-react";

interface ToxSectionProps {
  section: ToxicologicalSection;
}

const ToxSection: React.FC<ToxSectionProps> = ({ section }) => {
  // Helper function to get status badge
  const getStatusBadge = () => {
    switch (section.status) {
      case "valid":
        return <span className="tox-status-valid">Validé</span>;
      case "incomplete":
        return <span className="tox-status-incomplete">Incomplet</span>;
      case "verify":
        return <span className="tox-status-verify">À vérifier</span>;
      case "pending":
        return <span className="tox-status-pending">En attente</span>;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card className="tox-section-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            {section.title}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="whitespace-pre-line">{section.content}</div>
          
          {section.references.length > 0 && (
            <div className="pt-2 border-t">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Info className="h-4 w-4 mr-1" />
                <span>Sources:</span>
              </div>
              <ul className="text-sm list-disc ml-5 space-y-1">
                {section.references.map((ref, idx) => (
                  <li key={idx}>{ref}</li>
                ))}
              </ul>
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Mis à jour le {formatDate(section.acquisitionDate)}</span>
              </div>
            </div>
          )}
          
          {section.sourceUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {section.sourceUrls.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center text-tox-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Lien {idx + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ToxSection;
