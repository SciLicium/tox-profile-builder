
import { z } from "zod";
import { ToxSectionType } from "@/types";

// Define the schema for toxicological section form
export const toxSectionSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  content: z.string().min(1, "Le contenu est obligatoire"),
  sectionType: z.nativeEnum(ToxSectionType),
  sourceUrls: z.string()
    .transform(str => str ? str.split('\n').filter(s => s.trim() !== '') : []),
  referenceList: z.string()
    .transform(str => str ? str.split('\n').filter(s => s.trim() !== '') : []),
  status: z.enum(['valid', 'incomplete', 'verify', 'pending'])
    .default('pending'),
});

// Create a type from the schema
export type ToxSectionFormValues = z.infer<typeof toxSectionSchema>;
