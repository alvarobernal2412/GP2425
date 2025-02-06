import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Calendar, Clock, Hospital, Cake } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { completeAppointment, cancelAppointment, noShowAppointment } from '@/services/appointment';
import { useNavigate } from 'react-router-dom';
import { WeatherDisplay } from '@/components/weather';
import doctorData from '@/utils/doctorData';
import clinicData from '@/utils/clinicData';
import patientData from '@/utils/patientData';
import appointmentData from '@/utils/appointmentData';
import userData from '@/utils/userData';
import weatherData from '@/utils/weatherData';

export function AppointmentDetails() {
  const [appointment, setAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [patient, setPatient] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const appointmentId = window.location.pathname.split('/').pop();

  useEffect(() => {
    fetchAppointment(appointmentId);
  }, [appointmentId]);

  const fetchAppointment = async (appointmentId) => {
    try {
      // const appointmentData = await getAppointmentById(appointmentId);
      const appointment = appointmentData.find((appointment) => appointment.appointmentId === appointmentId);
      await Promise.all([
        fetchDoctorData(appointment.doctorId),
        fetchClinicData(appointment.clinicId),
        fetchPatientData(appointment.patientId),
        fetchWeather(appointmentId),
      ]);
      if (userData.roles.includes('clinicadmin')) {
        setAllowed(appointment.clinicId === userData.clinicId);
      } else if (userData.roles.includes('doctor')) {
        setAllowed(appointment.doctorId === userData.doctorid);
      } else if (userData.roles.includes('patient')) {
        setAllowed(appointment.patientId === userData.patientid);
      } else {
        setAllowed(false);
      }
      setAppointment(appointment);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorData = async (doctorId) => {
    try {
      const doctor = doctorData;
      setDoctor(doctor);
    } catch (err) {
      setError(err);
    }
  };

  const fetchClinicData = async (clinicId) => {
    try {
      const clinic = clinicData;
      setClinic(clinic);
    } catch (err) {
      setError(err);
    }
  };

  const fetchPatientData = async (patientId) => {
    try {
      const patient = patientData.find((patient) => patient._id === patientId);
      setPatient(patient);
    } catch (err) {
      setError(err);
    }
  };

  const fetchWeather = async (appointmentId) => {
    try {
      setWeather(weatherData);
    } catch (err){
      console.error(err);
      setWeather(null);
    }
  };

  const handleAction = (action) => {
    if (action === 'complete') {
      completeAppointment(appointmentId).then(() => fetchAppointment(appointmentId));
    } else if (action === 'cancel') {
      cancelAppointment(appointmentId).then(() => fetchAppointment(appointmentId));
    } else if (action === 'no-show') {
      noShowAppointment(appointmentId).then(() => fetchAppointment(appointmentId));
    } else if (action === 'history') {
      navigate(`/app/history/${appointment.patientId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Spinner className="mb-4" />
        <div className="text-center text-gray-500">
          Loading appointment, please wait...
        </div>
      </div>
    );
  }

  if (!loading && allowed === false) {
    return <div className="text-red-500">You are not allowed to view this appointment.</div>;
  }

  if (error || !appointment || !doctor || !clinic) {
    return <div className="text-red-500">Error loading appointment details.</div>;
  }

  if (error || !appointment || !doctor || !clinic) {
    return <div className="text-red-500">Error loading appointment details.</div>;
  }

  return (
    <div className="flex flex-col h-dvh max-h-dvh w-9/12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
        <div className="p-2 text-left">
          <h2 className="text-2xl font-bold">
            { appointment.specialty.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) } Appointment
          </h2>
          <p className="text-gray-500">Appointment ID: {appointmentId}</p>
        </div>
        <Badge variant={appointment.status === 'pending' ? 'default' : 'secondary'} className="text-lg self-center">
          {appointment.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
        <div>
          <h3 className="text-xl font-semibold mb-4">Appointment Details</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{format(new Date(appointment.appointmentDate), 'PPPP')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{format(new Date(appointment.appointmentDate), 'p')}</span>
            </div>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              <span>Dr. {doctor.name} {doctor.surname}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Clinic Information</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <Hospital className="w-5 h-5 mr-2 mt-1" />
              <span>{clinic.name}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{clinic.city}, {clinic.postalCode}, {clinic.countryCode}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col items-center m-4 p-4">
        {weather ? (
          <WeatherDisplay weatherData={weather} />
        ) : (
          <div className="text-gray-500">Weather data not available</div>
        )}
      </div>

      {userData.roles.includes('doctor') && (
        <>
          <Separator />
          <div className='p-4'>
            <h3 className="text-xl font-semibold mb-4">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>{patient.name} {patient.surname}</span>
              </div>
              <div className="flex items-center">
                <Cake className="w-5 h-5 mr-2" />
                <span>{format(new Date(patient.birthdate), 'PPP')}</span>
              </div>
            </div>
            <Button className='m-4' onClick={() => handleAction('history')}>View Patient History</Button>
          </div>
        </>
      )}

      {userData.roles.includes('doctor') && (
        <div className="flex justify-end space-x-4">
          <Button onClick={() => handleAction('complete')}>Complete</Button>
          <Button variant="outline" onClick={() => handleAction('cancel')}>Cancel</Button>
          <Button variant="destructive" onClick={() => handleAction('no-show')}>No Show</Button>
        </div>
      )}
    </div>
  );
}
