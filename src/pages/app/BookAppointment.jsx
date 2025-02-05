import { useState, useEffect, useMemo } from 'react';
import { addDays, format, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useParams } from 'react-router-dom';
import { alertAppointment } from '@/services/alert';
import { getDoctorData } from '@/services/staff';
import { getClinicData } from '@/services/payments';
import { getAvailableAppointments, bookAppointment } from '@/services/appointment';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/use-auth';

export function BookingSystem() {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableHours, setAvailableHours] = useState([]);
  const [error, setError] = useState(null);

  const doctorId = useParams().doctorId;
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorData();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (doctor) {
      fetchAvailableHours(date, doctorId, doctor.clinicId);
    }
  }, [date, doctor]);

  const fetchAvailableHours = async (date, doctorId, clinicId) => {
    try {
      setLoading(true);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await getAvailableAppointments(clinicId, doctorId, formattedDate);
      const availableSlots = response.map((appt) => format(new Date(appt.appointmentDate), 'HH:mm'));
      setAvailableHours(availableSlots);
      setLoading(false);
    } catch {
      setAvailableHours([]);
      setLoading(false);
    }
  };

  const fetchDoctorData = async () => {
    try {
      const response = await getDoctorData(doctorId);
      setDoctor(response);
      fetchClinicData(response.clinicId);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    }
  };

  const fetchClinicData = async (clinicId) => {
    try {
      const response = await getClinicData(clinicId);
      setClinic(response);
    } catch (error) {
      console.error('Error fetching clinic data:', error);
    }
  };

  const disabledDays = useMemo(() => {
    const today = startOfDay(new Date());
    const thirtyDaysLater = addDays(today, 30);
    return { before: today, after: thirtyDaysLater };
  }, []);

  const handleDateSelect = (value) => {
    const today = startOfDay(new Date());
    switch (value) {
    case 'today':
      setDate(today);
      break;
    case 'tomorrow':
      setDate(addDays(today, 1));
      break;
    case 'in3days':
      setDate(addDays(today, 3));
      break;
    case 'in1week':
      setDate(addDays(today, 7));
      break;
    default:
      setDate(today);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setIsDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const [hours, minutes] = selectedTime.split(':');
      const selectedDate = new Date();
      selectedDate.setHours(hours);
      selectedDate.setMinutes(minutes);
      selectedDate.setSeconds(0);
      selectedDate.setHours(selectedDate.getHours() - 1);

      const adjustedTime = format(selectedDate, 'HH:mm');
      const appointmentDate = `${formattedDate}T${adjustedTime}:00`;
      bookAppointment(userData.patientid, clinic._id, doctorId, doctor.specialty, appointmentDate).then(() => {
        alertAppointment(userData.email, clinic.name, appointmentDate, doctor.name);
        navigate('/app/appointments');
      });
    } catch (error) {
      setError('Failed to book the appointment. Please try again later.');
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Book an Appointment</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select a Date</CardTitle>
            <CardDescription>Choose your preferred appointment date (next 30 days)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={handleDateSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="in3days">In 3 days</SelectItem>
                <SelectItem value="in1week">In a week</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                disabled={disabledDays}
                className="rounded-md"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Time Slots</CardTitle>
            <CardDescription>
              Showing available slots for {format(date, 'MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex-col center items-center justify-center h-[300px]">
                <Spinner />
                <p className="text-center text-muted-foreground">Loading available slots...</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] rounded-md p-4">
                {availableHours.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {availableHours.map((hour) => (
                      <Button key={hour} variant="outline" onClick={() => handleTimeSelect(hour)}>
                        {hour}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No available slots for the selected date 🙁.
                  </p>
                )}
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
      {error && (
        <div className="text-red-500 text-center mt-4">
          <p>{error}</p>
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to book an appointment for:
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-semibold">{format(date, 'MMMM d, yyyy')} at {selectedTime}</p>
            <p className="text-md">{doctor ? `Dr. ${doctor.name} ${doctor.surname} - ${doctor.specialty.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}` : 'Loading doctor info...'}</p>
            <p className="text-md">{clinic ? `${clinic.name}, ${clinic.city}, ${clinic.postalCode}` : 'Loading clinic info...'}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmBooking}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
