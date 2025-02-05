import { client } from '@/api/axiosClient';
import { parseWorkshiftDateTime } from '@/utils/utils';

export async function workshiftsByDoctor(doctorId) {
  return client.get(`/workshifts/doctor/${doctorId}`).then(res => res.data);
}

export async function createWorkshift({ date, startTime, endTime, doctorId, clinicId }) {
  const { startDate, duration } = parseWorkshiftDateTime(date, startTime, endTime);

  const workshift = {
    doctorId,
    clinicId,
    startDate,
    duration,
  };
  return client.post('/workshifts', workshift).then(res => res.data);
}

export async function updateWorkshift({ id, date, startTime, endTime, clinicId}) {
  const { startDate, duration } = parseWorkshiftDateTime(date, startTime, endTime);
  const workshift = {
    clinicId,
    startDate,
    duration,
  };
  return client.put(`/workshifts/${id}`, workshift).then(res => res.data);
}

export async function deleteWorkshift(id) {
  return client.delete(`/workshifts/${id}`).then(res => res.data);
}
