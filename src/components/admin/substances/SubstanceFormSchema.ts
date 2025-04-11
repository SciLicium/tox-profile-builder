
import { z } from "zod";

// Define the schema for substance form
export const substanceSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  inciName: z.string().optional(),
  casNumber: z.string().optional(),
  smiles: z.string().optional(),
  description: z.string().optional(),
  regulatoryStatus: z.string().optional(),
  isDraft: z.boolean().default(false),
});

// Create a type from the schema
export type SubstanceFormValues = z.infer<typeof substanceSchema>;
