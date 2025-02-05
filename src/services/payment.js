import { client } from '@/api/axiosClient';

export function getAllClinics() {
  return client.get('/clinics/');
}