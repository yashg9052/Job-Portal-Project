import {z} from "zod";

export const job_schema = z.object({
    title:z.string().min(5).max(100),
    description:z.string().min(20).max(5000),
    skills:z.array(z.string()).min(1),
    expierence:z.string().min(1).max(50),
    location:z.string().min(2).max(100),
    salary:z.object({
        min:z.string().min(1),
        max:z.string().min(1),
        currency:z.string().min(1).optional(),
        period:z.enum(["MONTHLY","YEARLY"]).optional(),
    }),
});

