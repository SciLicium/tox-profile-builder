
export interface Substance {
  id: string;
  name: string;
  inciName: string;
  casNumber: string;
  smiles?: string;
  description?: string;
  regulatoryStatus?: string;
}

export interface ToxicologicalSection {
  id: string;
  substanceId: string;
  sectionType: ToxSectionType;
  title: string;
  content: string;
  references: string[];
  sourceUrls: string[];
  acquisitionDate: string; // ISO date string
  status: 'valid' | 'incomplete' | 'verify' | 'pending';
}

export enum ToxSectionType {
  ACUTE_TOXICITY = 1,
  IRRITATION_CORROSION = 2,
  REPEATED_DOSE = 3,
  MUTAGENICITY = 4,
  CARCINOGENICITY = 5,
  REPRODUCTION = 6,
  HUMAN_EXPOSURE = 7,
  PHOTOTOXICITY = 8,
  METABOLISM = 9,
  OTHER_DATA = 10,
  CONCLUSION = 11
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
