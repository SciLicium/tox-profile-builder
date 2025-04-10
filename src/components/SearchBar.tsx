
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Substance } from "../types";
import { searchSubstances, getRecentSearches } from "../data/sampleData";

interface SearchBarProps {
  onSelectSubstance: (substance: Substance) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectSubstance }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Substance[]>([]);
  const [showResults, setShowResults] = useState(false);
  const recentSearches = getRecentSearches();

  const handleSearch = () => {
    if (query.trim()) {
      const results = searchSubstances(query);
      setSearchResults(results);
      setShowResults(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectSubstance = (substance: Substance) => {
    setQuery("");
    setShowResults(false);
    onSelectSubstance(substance);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Rechercher par nom, CAS ou INCI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        </div>
        <Button onClick={handleSearch} className="bg-tox-primary hover:bg-tox-secondary">
          Rechercher
        </Button>
      </div>

      {showResults && (
        <div className="mt-4">
          <h3 className="font-medium text-lg mb-2">Résultats de recherche</h3>
          {searchResults.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              {searchResults.map((substance) => (
                <div
                  key={substance.id}
                  className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectSubstance(substance)}
                >
                  <div className="font-medium">{substance.name}</div>
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>INCI: {substance.inciName}</span>
                    <span>CAS: {substance.casNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded border">
              Aucun résultat trouvé pour "{query}"
            </div>
          )}
        </div>
      )}

      {!showResults && (
        <div className="mt-8">
          <h3 className="font-medium text-lg mb-2">Recherches récentes</h3>
          <div className="border rounded-md overflow-hidden">
            {recentSearches.map((substance) => (
              <div
                key={substance.id}
                className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectSubstance(substance)}
              >
                <div className="font-medium">{substance.name}</div>
                <div className="text-sm text-gray-600 flex justify-between">
                  <span>INCI: {substance.inciName}</span>
                  <span>CAS: {substance.casNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
