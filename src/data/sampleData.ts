
import { Substance, ToxicologicalSection, ToxSectionType } from "../types";

export const sampleSubstances: Substance[] = [
  {
    id: "1",
    name: "Sodium Lauryl Sulfate",
    inciName: "SODIUM LAURYL SULFATE",
    casNumber: "151-21-3",
    smiles: "CCCCCCCCCCCCOS(=O)(=O)O[Na]",
    description: "Anionic surfactant used in many cleaning and hygiene products.",
    regulatoryStatus: "Approved for use in cosmetics with restrictions",
    status: "published"
  },
  {
    id: "2",
    name: "Retinol",
    inciName: "RETINOL",
    casNumber: "68-26-8",
    smiles: "CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=C)C=O)C",
    description: "Vitamin A form used in anti-aging products.",
    regulatoryStatus: "Approved for use in cosmetics with restrictions",
    status: "published"
  },
  {
    id: "3",
    name: "Phenoxyethanol",
    inciName: "PHENOXYETHANOL",
    casNumber: "122-99-6",
    smiles: "OCCOc1ccccc1",
    description: "Preservative used in cosmetics and personal care products.",
    regulatoryStatus: "Approved for use in cosmetics (max 1%)",
    status: "published"
  }
];

export const sampleToxSections: ToxicologicalSection[] = [
  // Sodium Lauryl Sulfate sections
  {
    id: "1-1",
    substanceId: "1",
    sectionType: ToxSectionType.ACUTE_TOXICITY,
    title: "Toxicité aiguë",
    content: "Oral LD50 (rat): 1200 mg/kg\nDermal LD50 (rabbit): >2000 mg/kg\nInhalation LC50 (rat): >3.9 mg/l/1h",
    references: ["ECHA Dossier (2020)", "SCCS Opinion (2015)"],
    sourceUrls: ["https://echa.europa.eu/substance-information/-/substanceinfo/100.033.458"],
    acquisitionDate: "2023-10-15T10:30:00Z",
    status: "valid"
  },
  {
    id: "1-2",
    substanceId: "1",
    sectionType: ToxSectionType.IRRITATION_CORROSION,
    title: "Irritation et corrosion",
    content: "Irritant pour la peau (lapin, OCDE 404)\nIrritant sévère pour les yeux (lapin, OCDE 405)",
    references: ["ECHA Dossier (2020)", "CIR Final Report (2005)"],
    sourceUrls: ["https://echa.europa.eu/substance-information/-/substanceinfo/100.033.458"],
    acquisitionDate: "2023-10-15T10:35:00Z",
    status: "valid"
  },
  {
    id: "1-3",
    substanceId: "1",
    sectionType: ToxSectionType.REPEATED_DOSE,
    title: "Toxicité à doses répétées",
    content: "NOAEL (rat, oral, 90 jours): 100 mg/kg/jour\nNOAEL (rat, dermal, 90 jours): >200 mg/kg/jour",
    references: ["ECHA Dossier (2020)"],
    sourceUrls: ["https://echa.europa.eu/substance-information/-/substanceinfo/100.033.458"],
    acquisitionDate: "2023-10-15T10:40:00Z", 
    status: "incomplete"
  },
  {
    id: "1-4",
    substanceId: "1",
    sectionType: ToxSectionType.MUTAGENICITY,
    title: "Mutagénicité/génotoxicité",
    content: "Test d'Ames: Négatif\nTest d'aberration chromosomique (in vitro): Négatif\nTest du micronoyau (in vivo): Négatif",
    references: ["ECHA Dossier (2020)", "SCCS Opinion (2015)"],
    sourceUrls: ["https://echa.europa.eu/substance-information/-/substanceinfo/100.033.458"],
    acquisitionDate: "2023-10-15T10:45:00Z",
    status: "valid"
  },
  {
    id: "1-5",
    substanceId: "1",
    sectionType: ToxSectionType.CARCINOGENICITY,
    title: "Cancérogenèse",
    content: "Pas de potentiel cancérogène observé dans les études à long terme chez le rat et la souris.",
    references: ["ECHA Dossier (2020)"],
    sourceUrls: ["https://echa.europa.eu/substance-information/-/substanceinfo/100.033.458"],
    acquisitionDate: "2023-10-15T10:50:00Z",
    status: "incomplete"
  },
  {
    id: "1-6",
    substanceId: "1",
    sectionType: ToxSectionType.REPRODUCTION,
    title: "Reprotoxicité / tératogénicité",
    content: "NOAEL (rat, oral, développement): 300 mg/kg/jour\nPas d'effet tératogène observé.",
    references: ["ECHA Dossier (2020)"],
    sourceUrls: ["https://echa.europa.eu/substance-information/-/substanceinfo/100.033.458"],
    acquisitionDate: "2023-10-15T10:55:00Z",
    status: "verify"
  },
  {
    id: "1-7",
    substanceId: "1",
    sectionType: ToxSectionType.HUMAN_EXPOSURE,
    title: "Exposition humaine et valeurs réglementaires",
    content: "DJA: Non établie\nCosing: Autorisé comme agent tensioactif dans les produits cosmétiques.\nConcentration maximale recommandée dans les produits à rincer: 2%",
    references: ["Cosing Database", "SCCS Opinion (2015)"],
    sourceUrls: ["https://ec.europa.eu/growth/tools-databases/cosing/"],
    acquisitionDate: "2023-10-15T11:00:00Z",
    status: "valid"
  },
  {
    id: "1-8",
    substanceId: "1",
    sectionType: ToxSectionType.PHOTOTOXICITY,
    title: "Phototoxicité et sensibilisation",
    content: "Test de sensibilisation cutanée (LLNA): Négatif\nPhototoxicité (3T3 NRU): Négative",
    references: ["ECHA Dossier (2020)"],
    sourceUrls: ["https://echa.europa.eu/substance-information/-/substanceinfo/100.033.458"],
    acquisitionDate: "2023-10-15T11:05:00Z",
    status: "valid"
  },
  {
    id: "1-9",
    substanceId: "1",
    sectionType: ToxSectionType.METABOLISM,
    title: "Métabolisme et excrétion",
    content: "Rapidement absorbé par voie orale. Métabolisé principalement dans le foie via des processus d'oxydation. Excrété majoritairement dans l'urine sous forme de métabolites.",
    references: ["ECHA Dossier (2020)"],
    sourceUrls: ["https://echa.europa.eu/substance-information/-/substanceinfo/100.033.458"],
    acquisitionDate: "2023-10-15T11:10:00Z",
    status: "incomplete"
  },
  {
    id: "1-10",
    substanceId: "1",
    sectionType: ToxSectionType.OTHER_DATA,
    title: "Autres données toxicologiques",
    content: "Faible potentiel de bioaccumulation.\nFacilement biodégradable.",
    references: ["ECHA Dossier (2020)"],
    sourceUrls: ["https://echa.europa.eu/substance-information/-/substanceinfo/100.033.458"],
    acquisitionDate: "2023-10-15T11:15:00Z",
    status: "pending"
  },
  {
    id: "1-11",
    substanceId: "1",
    sectionType: ToxSectionType.CONCLUSION,
    title: "Conclusion et niveau de risque",
    content: "Substance bien caractérisée du point de vue toxicologique. Principaux effets: irritation cutanée et oculaire. Utilisable dans les produits cosmétiques à rincer jusqu'à 2% et dans les produits sans rinçage jusqu'à 0.5%. Marge de sécurité estimée adéquate pour ces usages dans les conditions normales d'utilisation.",
    references: ["SCCS Opinion (2015)", "CIR Final Report (2005)"],
    sourceUrls: ["https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_190.pdf"],
    acquisitionDate: "2023-10-15T11:20:00Z",
    status: "valid"
  },

  // Similar sections for other substances would go here
];

export const getSubstanceById = (id: string): Substance | undefined => {
  return sampleSubstances.find(substance => substance.id === id);
};

export const getToxSectionsBySubstanceId = (substanceId: string): ToxicologicalSection[] => {
  return sampleToxSections.filter(section => section.substanceId === substanceId);
};

export const searchSubstances = (query: string): Substance[] => {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];
  
  return sampleSubstances.filter(substance => 
    substance.name.toLowerCase().includes(normalizedQuery) ||
    substance.inciName.toLowerCase().includes(normalizedQuery) ||
    substance.casNumber.includes(normalizedQuery)
  );
};

export const getRecentSearches = (): Substance[] => {
  // In a real app, this would come from a database
  // For now, just return some sample substances
  return sampleSubstances.slice(0, 3);
};
