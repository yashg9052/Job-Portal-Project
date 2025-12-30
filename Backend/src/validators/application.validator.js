import { z } from "zod";

/* Reusable ObjectId validator */
const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

/* Status enum */
const statusEnum = z.enum([
  "applied",
  "shortlisted",
  "interview",
  "rejected",
  "hired",
]);

/* Status history schema */
const statusHistorySchema = z.object({
  status: statusEnum,
  changedAt: z.date().optional(),
});

/* Main application validator */
export const applicationSchema = z.object({
  
  

  resumeUrl: z
    .string()
    .url("Resume URL must be a valid URL"),

  status: statusEnum.optional(), // default handled by mongoose

  appliedAt: z.date().optional(),

  statusHistory: z.array(statusHistorySchema).optional(),
});
