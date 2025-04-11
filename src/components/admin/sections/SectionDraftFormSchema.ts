
import { z } from "zod";
import { ToxSectionType } from "@/types";

// Define the schema for section draft form
export const sectionDraftSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  content: z.string().optional(),
  sectionType: z.nativeEnum(ToxSectionType),
  sourceUrls: z.string()
    .transform(str => str ? str.split('\n').filter(s => s.trim() !== '') : []),
  referenceList: z.string()
    .transform(str => str ? str.split('\n').filter(s => s.trim() !== '') : []),
});

// Create a type from the schema
export type SectionDraftFormValues = z.infer<typeof sectionDraftSchema>;
