import { z } from 'zod';
import { specialties } from '@/utils/utils';

const dniRegex = /^[0-9]{8}[A-Z]$/;
  
export const registerStaffSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .transform((val) => val.trim()),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be at most 32 characters long')
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .refine((value) => !/\s/.test(value), {
      message: 'Password must not contain spaces',
    })
    .transform((val) => val.trim()),
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .transform((val) => val.trim()),
  surname: z
    .string({ required_error: 'Surname is required' })
    .min(1, 'Surname is required')
    .transform((val) => val.trim()),
  specialty: z
    .string({ required_error: 'Specialty is required' })
    .refine((value) => specialties.includes(value), {
      message: 'Invalid specialty',
    }),
  dni: z
    .string({ required_error: 'DNI is required' })
    .regex(dniRegex, 'Invalid DNI format')
    .refine((value) => {
      const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
      const number = parseInt(value.slice(0, 8), 10);
      const letter = value.slice(8, 9);
      return letters[number % 23] === letter;
    }, {
      message: 'Invalid DNI number',
    })
});
