import { z } from "zod";
import { de } from "zod/locales";

const name = z
  .string()
  .trim()
  .min(3, { message: "Name must be at least 3 characters long" })
  .max(100, { message: "Name must be at most 100 characters long" });
const email = z.string().trim().email({ message: "Invalid email address" });
const password = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(100, { message: "Password must be at most 100 characters long" });

const role = z.enum(["applicant", "recruiter", "admin"], {
  errorMap: () => ({
    message: "Role must be either applicant, recruiter, or admin",
  }),
});
const provider = z.enum(["local", "google"], {
  errorMap: () => ({ message: "Provider must be either local or google" }),
}).optional();

export const registerUserSchema = z.object({
  name,
  email,
  password,
  role,
  provider,
 
  
});

export const loginUserSchema = z.object({
  email,
  password,
  provider: provider.optional(),
});
