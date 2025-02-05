import { client } from '@/api/axiosClient';

export function getAppointmentsByPatiendId(patientId) {
  return client.get(`/appointments/patient/${patientId}`);
}

export function getAppointmentsByDoctorId(doctorId) {
  return client.get(`/appointments/doctor/${doctorId}`);
}

export function bookAppointment(patientId, clinicId, doctorId, specialty, appointmentDate) {
  return client.post('/appointments', {
    patientId: patientId,
    clinicId: clinicId,
    doctorId: doctorId,
    specialty: specialty,
    appointmentDate: appointmentDate,
  });
}

export function getAppointmentById(appointmentId) {
  return client.get(`/appointments/${appointmentId}`).then(response => response.data);
}

export function getAppointmentWeather(appointmentDate) {
  return client.get(`/appointments/${appointmentDate}/weather`).then(response => response.data);
}

export function cancelAppointment(appointmentId) {
  return client.put(`/appointments/${appointmentId}/cancel`);
}

export function completeAppointment(appointmentId) {
  return client.put(`/appointments/${appointmentId}/complete`);
}

export function noShowAppointment(appointmentId) {
  return client.put(`/appointments/${appointmentId}/noshow`);
}

export function getAvailableAppointments(clinicId, doctorId, date) {
  return client
    .get('/appointments/available', {
      params: {
        clinicId,
        doctorId,
        date,
      },
    })
    .then(response => response.data);
}