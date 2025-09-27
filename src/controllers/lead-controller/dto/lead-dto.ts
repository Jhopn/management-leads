import { z } from 'zod';

const brazilianPhoneRegex = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/;

export const createLeadSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email("Formato de e-mail inválido").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail não está em um formato válido"),
  telephone: z.string().regex(brazilianPhoneRegex, "Invalid Brazilian phone number format."), position: z.string(),
  dateBirth: z.coerce.date().refine(birthDate => {
    const today = new Date();
    const cutoffDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    return birthDate <= cutoffDate;
  }, {
    message: "The user must be at least 16 years old."
  }),
  message: z.string(),

  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();