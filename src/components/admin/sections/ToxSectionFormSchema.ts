
import { z } from "zod";
import { ToxSectionType } from "@/types";

// Helper function to handle string to array conversion
const stringToArray = (value: string) => 
  value ? value.split('\n').filter(item => item.trim() !== '') : [];

// Define schema
export const toxSectionSchema = z.object({
  sectionType: z.nativeEnum(ToxSectionType),
  title: z.string().min(1, "Le titre est obligatoire"),
  content: z.string().optional(),
  sourceUrls: z.string()
    .transform(stringToArray),
  referenceList: z.string()
    .transform(stringToArray),
  status: z.enum(['valid', 'incomplete', 'verify', 'pending']),
});

// Create type from schema
export type ToxSectionFormValues = z.infer<typeof toxSectionSchema>;

// Define an interface that represents the actual form input values before transformation
export interface ToxSectionFormInputs {
  sectionType: ToxSectionType;
  title: string;
  content?: string;
  sourceUrls: string;
  referenceList: string;
  status: 'valid' | 'incomplete' | 'verify' | 'pending';
}
