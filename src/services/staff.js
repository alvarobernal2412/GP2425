import { client } from '@/api/axiosClient';

export function registerStaff({ name, surname, email, password, specialty, dni }) {
  return client.post(
    '/staff/register',
    { name, surname, email, password, specialty, dni }
  );
}

export function getDoctorsBySpeciality({ clinicId, speciality }) {
  const url = speciality 
    ? `/staff/clinic/${clinicId}/speciality/${speciality}` 
    : `/staff/clinic/${clinicId}/speciality`;
  return client.get(url);
}

export function getMyself() {
  return client.get('/staff/me');
}

export async function getDoctorData(doctorId) {
  const response = await client.get(`/staff/${doctorId}`);
  return response.data;
}

export function updateSpecialty(doctorId, specialty) {
  return client.put(`/staff/${doctorId}`, { specialty }).then(response => response.data);
}

export function deleteDoctor(doctorId) {
  return client.delete(`/staff/${doctorId}`).then(response => response.data);
}