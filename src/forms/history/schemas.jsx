import { z } from 'zod';

const pastDateString = z
  .string()
  .refine((val) => val === 'dd/mm/aaaa' || val === '' || !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  })
  .transform((val) => (val === 'dd/mm/aaaa' || val === '' ? null : new Date(val)))
  .refine((date) => date === null || date <= new Date(), {
    message: 'Date must be today or in the past',
  });

const dateString = z
  .string()
  .refine((val) => val === 'dd/mm/aaaa' || val === '' || !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  })
  .transform((val) => (val === 'dd/mm/aaaa' || val === '' ? null : new Date(val)));

export const conditionSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .transform((val) => val.trim()),
  details: z
    .string({ required_error: 'Details is required' })
    .min(1, 'Details is required')
    .transform((val) => val.trim()),
  since: pastDateString.refine((date) => date !== null, {
    message: 'Since date is required',
  }),
  until: pastDateString.optional(),
}).refine((data) => !data.until || data.until >= data.since, {
  message: 'Until date must be equal to or after since date',
  path: ['until'],
});

export const treatmentSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .transform((val) => val.trim()),
  instructions: z
    .string({ required_error: 'Instructions is required' })
    .min(1, 'Instructions is required')
    .transform((val) => val.trim()),
  startDate: dateString.refine((date) => date !== null, {
    message: 'Start date is required',
  }),
  endDate: dateString.refine((date) => date !== null, {
    message: 'End date is required',
  }),
}).refine((data) => !data.endDate || data.endDate >= data.startDate, {
  message: 'End date must be equal to or after start date',
  path: ['endDate'],
});