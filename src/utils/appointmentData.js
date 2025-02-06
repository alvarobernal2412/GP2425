const today = new Date();
const tomorrow = new Date(today.setDate(today.getDate() + 1));
const next = new Date(today.setDate(today.getDate() + 2));

const appointmentData = [
  {
    appointmentId: '3f92c5f5-7b22-4d4b-91eb-5b2a3f3f6f45',
    patientId: '8e16fd60-5b1d-4b7a-926b-9b23f0a1d7e8',
    clinicId: 'd8f5e7c1-9b6a-4b45-8f0d-2d1f9e3c6b7a',
    doctorId: '3a1d9c2f-57e4-4b2c-9256-8aef3f9d84c1', 
    specialty: 'geneticist',
    type: 'revision',
    appointmentDate: new Date(tomorrow.setHours(10, 0, 0, 0)), // tomorrow at 10:00
    appointmentEndDate: new Date(tomorrow.setHours(10, 60, 0, 0)), // tomorrow at 10:60
    duration: 60,
    status: 'pending',
  },
  {
    appointmentId: '3f92c5f5-7b22-4d4b-91eb-5b2a3f3f6f41',
    patientId: '8e16fd60-5b1d-4b7a-926b-9b23f0a1d7e3',
    clinicId: 'd8f5e7c1-9b6a-4b45-8f0d-2d1f9e3c6b7a',
    doctorId: '3a1d9c2f-57e4-4b2c-9256-8aef3f9d84c1', 
    specialty: 'geneticist',
    type: 'revision',
    appointmentDate: new Date(next.setHours(13, 0, 0, 0)), // tomorrow at 10:00
    appointmentEndDate: new Date(next.setHours(13, 60, 0, 0)), // tomorrow at 10:60
    duration: 60,
    status: 'pending',
  },
  {
    appointmentId: '3f92c5f5-7b22-4d4b-91eb-5b2a3f3f6f42',
    patientId: '8e16fd60-5b1d-4b7a-926b-9b23f0a1d7e3',
    clinicId: 'd8f5e7c1-9b6a-4b45-8f0d-2d1f9e3c6b7a',
    doctorId: '3a1d9c2f-57e4-4b2c-9256-8aef3f9d84c1', 
    specialty: 'geneticist',
    type: 'revision',
    appointmentDate: new Date(next.setHours(16, 0, 0, 0)), // tomorrow at 10:00
    appointmentEndDate: new Date(next.setHours(16, 60, 0, 0)), // tomorrow at 10:60
    duration: 60,
    status: 'pending',
  }
];

export default appointmentData;