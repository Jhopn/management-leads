import { z } from "zod";

export const createUserSchemaSwagger = z.object({
    name: z.string().min(1),
    email: z.string().email("Formato de e-mail inválido"),    
    password: z.string().min(6),
    accessRole: z.enum(['ADMIN', 'READER']),
})

export const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email("Formato de e-mail inválido").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail não está em um formato válido"),    
    password: z.string().min(6),
    accessRole: z.enum(['ADMIN', 'READER']),
})

export const updateUserSchema = createUserSchema.partial();