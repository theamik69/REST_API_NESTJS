import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    role: z.string().optional(),
    password: z.string().min(1).max(100).optional(),
  });
}
