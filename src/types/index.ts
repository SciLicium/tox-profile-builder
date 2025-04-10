
export interface Substance {
  id: string;
  name: string;
  inciName: string | null;
  casNumber: string | null;
  smiles?: string | null;
  description?: string | null;
  regulatoryStatus?: string | null;
  status: 'published' | 'draft';
}

export interface SectionDraft {
  id: string;
  substanceId: string;
  sectionType: string; // Changed to string to match database enum type
  title: string;
  content?: string;
  referenceList?: string[];
  sourceUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ToxicologicalSection {
  id: string;
  substanceId: string;
  sectionType: string; // Changed to string to match database enum type
  title: string;
  content: string;
  references: string[];
  sourceUrls: string[];
  acquisitionDate: string; // ISO date string
  status: 'valid' | 'incomplete' | 'verify' | 'pending';
}

// Changed to string enum to match database enum values
export enum ToxSectionType {
  ACUTE_TOXICITY = "acute_toxicity",
  IRRITATION_CORROSION = "irritation_corrosion",
  REPEATED_DOSE = "repeated_dose",
  MUTAGENICITY = "mutagenicity",
  CARCINOGENICITY = "carcinogenicity",
  REPRODUCTION = "reproduction",
  HUMAN_EXPOSURE = "human_exposure",
  PHOTOTOXICITY = "phototoxicity",
  METABOLISM = "metabolism",
  OTHER_DATA = "other_data",
  CONCLUSION = "conclusion"
}

export interface ScrapingSource {
  id: string;
  name: string;
  url: string;
  contentType: string;
  updateFrequency: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'toxicologist' | 'admin';
}

export interface SearchHistory {
  id: string;
  userId: string;
  substanceId: string;
  searchDate: string; // ISO date string
}

export interface Report {
  id: string;
  substanceId: string;
  userId: string;
  date: string; // ISO date string
  pdfContent?: string; // Or maybe a URL to the PDF
  userComment?: string;
}

// Map enum string values to human-readable French labels
export const toxSectionTypeLabels: Record<string, string> = {
  [ToxSectionType.ACUTE_TOXICITY]: 'Toxicité aiguë',
  [ToxSectionType.IRRITATION_CORROSION]: 'Irritation et corrosion',
  [ToxSectionType.REPEATED_DOSE]: 'Toxicité à doses répétées',
  [ToxSectionType.MUTAGENICITY]: 'Mutagénicité',
  [ToxSectionType.CARCINOGENICITY]: 'Cancérogénicité',
  [ToxSectionType.REPRODUCTION]: 'Toxicité pour la reproduction',
  [ToxSectionType.HUMAN_EXPOSURE]: 'Exposition humaine',
  [ToxSectionType.PHOTOTOXICITY]: 'Phototoxicité',
  [ToxSectionType.METABOLISM]: 'Métabolisme',
  [ToxSectionType.OTHER_DATA]: 'Autres données',
  [ToxSectionType.CONCLUSION]: 'Conclusion'
};
