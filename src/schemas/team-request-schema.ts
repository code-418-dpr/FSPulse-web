import { z } from "zod";

export const teamRequestSchema = z.object({
    name: z.string().min(1, "Название обязательно").min(3, "Название должно содержать минимум 3 символа"),
    description: z.string().nullable(),
});
