
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
    .transform(stringToArray)
    .or(z.array(z.string())),
  referenceList: z.string()
    .transform(stringToArray)
    .or(z.array(z.string())),
  status: z.enum(['valid', 'incomplete', 'verify', 'pending']),
});

// Create type from schema
export type ToxSectionFormValues = z.infer<typeof toxSectionSchema>;
