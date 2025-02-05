import { client } from '@/api/axiosClient';

export async function alertAppointment(email, clinic, dateAppointment, doctorName) {
  return client.post('/alert/alert-appointment', {
    email,
    clinic,
    dateAppointment,
    doctorName,
  });
}
