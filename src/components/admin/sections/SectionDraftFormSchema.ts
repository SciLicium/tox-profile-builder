
import { z } from "zod";
import { ToxSectionType } from "@/types";

// Helper function to handle string to array conversion
const stringToArray = (value: string) => 
  value ? value.split('\n').filter(item => item.trim() !== '') : [];

// Define schema
export const sectionDraftSchema = z.object({
  sectionType: z.nativeEnum(ToxSectionType),
  title: z.string().min(1, "Le titre est obligatoire"),
  content: z.string().optional(),
  sourceUrls: z.string()
    .transform(stringToArray),
  referenceList: z.string()
    .transform(stringToArray)
});

// Create type from schema
export type SectionDraftFormValues = z.infer<typeof sectionDraftSchema>;
