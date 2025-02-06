import { useState, useEffect } from 'react';
import patientData from '@/utils/patientData';

export function AppointmentCard({ date, patientId, startTime, endTime, color = 'rgba(180, 122, 234, 0.44)', onClick }) {
  const [patientName, setPatientName] = useState('');
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startPosition = (startHour - 7) * 60 + startMinute;
  const duration = (endHour - startHour) * 60 + (endMinute - startMinute);

  useEffect(() => {
    const fetchPatientName = async (patientId) => {
      try {
        const patientInfo = patientData.find((patient) => patient._id === patientId);
        setPatientName(`${patientInfo.name} ${patientInfo.surname}`);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPatientName(patientId);
  }, [patientId]);

  const style = {
    position: 'absolute',
    top: `${(startPosition/ 60) * 96 }px`,
    height: `${(duration/ 60) * 96 }px`,
    width: 'calc(100% - 1px)',
    padding: '5px',
    backgroundColor: color,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: '4px',
    border: '3px solid rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  return (
    <div style={style} onClick={onClick} className="hover:bg-blue-400">
      <span className="text-xs">{startTime}</span>
      <span className="text-xs">
        { patientName ? patientName : 'Appointment' }
      </span>
      <span className="text-xs">{endTime}</span>
    </div>
  );
}
