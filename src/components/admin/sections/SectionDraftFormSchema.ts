
import { z } from "zod";
import { ToxSectionType } from "@/types";

// Form schema for section drafts
export const sectionDraftSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  content: z.string().optional(),
  sectionType: z.string(),
  // Convert string input to string arrays for database storage
  sourceUrls: z.string().optional().transform(str => 
    str ? str.split('\n').filter(Boolean) : []
  ),
  referenceList: z.string().optional().transform(str => 
    str ? str.split('\n').filter(Boolean) : []
  ),
});

export type SectionDraftFormValues = z.infer<typeof sectionDraftSchema>;
