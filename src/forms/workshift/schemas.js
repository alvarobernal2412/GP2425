import { z } from 'zod';

export const WorkshiftFormSchema = z.object({
  date: z.date(),
  startTime: z.string().refine((val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
    message: 'Invalid time format',
  }),
  endTime: z.string().refine((val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
    message: 'Invalid time format',
  }),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}:00Z`);
  const end = new Date(`1970-01-01T${data.endTime}:00Z`);
  const diff = (end - start) / (1000 * 60);
  return end > start && diff >= 60;
}, {
  message: 'End Time must be after Start Time and at least 60 minutes later',
  path: ['endTime'],
});