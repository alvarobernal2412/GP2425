export const specialties = ['family_medicine', 'nursing', 'physiotherapy', 'gynecology', 'pediatrics',
  'dermatology', 'cardiology', 'neurology', 'orthopedics', 'psychiatry', 'endocrinology',
  'oncology', 'radiology', 'surgery', 'ophthalmology', 'urology',
  'anesthesiology', 'otolaryngology', 'gastroenterology', 'other'];

const specialtiesWithLabelsNoDefault = specialties.map(specialty => ({
  label: specialty.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
  value: specialty
}));

export const specialtiesWithLabels = [{ label: 'Select specialty', value: '' }, ...specialtiesWithLabelsNoDefault];

export function transformDatesToSchedule(id, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const formatTime = (date) => {
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return {
    id: id,
    date: startDate,
    startTime: formatTime(start),
    endTime: formatTime(end)
  };
}

export function transformDatesToAppointment(id, patientId, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const formatTime = (date) => {
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return {
    id: id,
    patientId: patientId,
    date: startDate,
    startTime: formatTime(start),
    endTime: formatTime(end)
  };
}

export function calculateDuration(startTime, endTime) {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  return endTotalMinutes - startTotalMinutes;
}

export function parseWorkshiftDateTime(date, startTime, endTime){
  const startDate = new Date(date);
  startDate.setHours(parseInt(startTime.split(':')[0]) + 1);
  startDate.setMinutes(parseInt(startTime.split(':')[1]));
  const duration = (parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0])) * 60;
  return { startDate, duration };
}
