import { useState, useEffect } from 'react';
import { parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import FutureAppointments from '@/components/future-appointments';
import PastAppointments from '@/components/past-appointments';
import { getAppointmentsByPatiendId } from '@/services/appointment';
import { useNavigate } from 'react-router-dom';
import { specialties } from '@/utils/utils';
import { getDoctorData } from '@/services/staff';
import { getClinicData } from '@/services/payments';
import { useAuth } from '@/hooks/use-auth';

export function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const navigate = useNavigate();
  const { userData } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const patientId = userData.patientid;
    const { data } = await getAppointmentsByPatiendId(patientId);
    for (let appointment of data) {
      const doctorData = await getDoctorData(appointment.doctorId);
      const clinicData = await getClinicData(doctorData.clinicId);
      appointment.doctorName = `${doctorData.name} ${doctorData.surname}`;
      appointment.clinicName = clinicData.name;
    }
    setAppointments(data);
    setLoading(false);
  };  

  const futureAppointments = appointments.filter(appointment =>
    isAfter(parseISO(appointment.appointmentDate), new Date())
  );

  const pastAppointments = appointments.filter(appointment =>
    isBefore(parseISO(appointment.appointmentDate), new Date())
  );

  const filteredPastAppointments = pastAppointments.filter(appointment => {
    const appointmentDate = parseISO(appointment.appointmentDate);
    return (
      (selectedSpecialty === 'all' || appointment.specialty === selectedSpecialty) &&
      (selectedStatus === 'all' || appointment.status === selectedStatus) &&
      (!startDate || isAfter(appointmentDate, startDate) || isEqual(appointmentDate, startDate)) &&
      (!endDate || isBefore(appointmentDate, endDate) || isEqual(appointmentDate, endDate))
    );
  });

  const statuses = ['pending', 'cancelled', 'completed', 'no-show'];

  const onViewAppointment = (appointmentId) => {
    navigate(`/app/appointments/${appointmentId}`);
  };

  return (
    <div className="flex flex-col h-dvh max-h-dvh w-full">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">My Appointments</h1>
      </div>
      <Tabs defaultValue="future" className="flex-1 flex flex-col min-h-0 px-4 sm:px-8">
        <TabsList className="mb-2 sm:mb-4 overflow-auto flex-nowrap flex gap-2 sm:gap-4">
          <TabsTrigger value="future">Future Appointments</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="future" className="flex-1 min-h-0">
          <FutureAppointments appointments={futureAppointments} loading={loading} onViewAppointment={onViewAppointment} />
        </TabsContent>
        <TabsContent value="past" className="flex-1 min-h-0">
          <div className="flex flex-col h-full">
            <div className="mb-4 flex flex-col sm:flex-wrap sm:flex-row gap-4">
              <Select onValueChange={setSelectedSpecialty} value={selectedSpecialty}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <DatePicker
                  selected={startDate}
                  onSelect={setStartDate}
                  placeholderText="Start Date"
                  className="w-full sm:w-auto"
                />
                <span className="hidden sm:inline">to</span>
                <DatePicker
                  selected={endDate}
                  onSelect={setEndDate}
                  placeholderText="End Date"
                  className="w-full sm:w-auto"
                />
              </div>
              <Button
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                }}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Clear Dates
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <PastAppointments
                appointments={filteredPastAppointments}
                loading={loading}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onViewAppointment={onViewAppointment}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
