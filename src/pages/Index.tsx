
import React, { useState } from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import SubstanceProfile from "../components/SubstanceProfile";
import { Substance } from "../types";
import { getToxSectionsBySubstanceId } from "../data/sampleData";
import { Beaker, FileText, Database } from "lucide-react";

const Index: React.FC = () => {
  const [selectedSubstance, setSelectedSubstance] = useState<Substance | null>(
    null
  );

  const handleSelectSubstance = (substance: Substance) => {
    setSelectedSubstance(substance);
    // In a real app, you would log this search to history
  };

  const handleBack = () => {
    setSelectedSubstance(null);
  };

  return (
    <Layout>
      {!selectedSubstance ? (
        <div>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              PreFillTox
            </h1>
            <p className="text-xl text-gray-600">
              Profils toxicologiques automatisés pour l'évaluation de sécurité cosmétique
            </p>
          </div>

          <SearchBar onSelectSubstance={handleSelectSubstance} />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Beaker className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Données toxicologiques complètes</h3>
              <p className="text-gray-600">
                11 sections standardisées pour une évaluation exhaustive des risques.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Rapports PDF exportables</h3>
              <p className="text-gray-600">
                Générez des rapports professionnels prêts à l'emploi pour vos DIP.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Sources réglementaires</h3>
              <p className="text-gray-600">
                Données issues de Cosing, ECHA, SCCS et autres bases réglementaires.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <SubstanceProfile
          substance={selectedSubstance}
          sections={getToxSectionsBySubstanceId(selectedSubstance.id)}
          onBack={handleBack}
        />
      )}
    </Layout>
  );
};

export default Index;
