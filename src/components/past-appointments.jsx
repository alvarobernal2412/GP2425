import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ClockIcon, UserIcon, HospitalIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';

export default function PastAppointments({ appointments, loading, currentPage, setCurrentPage, onViewAppointment }) {
  const itemsPerPage = 6;
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = appointments.slice(startIndex, endIndex);
  const [activeCard, setActiveCard] = useState(null);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Spinner className="mb-4" />
        <div className="text-center text-gray-500">
          Loading appointments, please wait...
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          No appointments found 😕.
        </div>
      </div>
    );
  }

  const handleCardClick = (appointmentId) => {
    setActiveCard(appointmentId);
    setTimeout(() => {
      setActiveCard(null);
      onViewAppointment(appointmentId);
    }, 150);
  };

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
          {currentAppointments.map((appointment) => (
            <Card
              key={appointment._id}
              className={`p-2 sm:p-6 sm:hover:shadow-lg transition-all duration-200
                cursor-pointer sm:cursor-default select-none
                ${activeCard === appointment._id ? 'scale-95' : 'scale-100'}
                sm:scale-100 ${activeCard !== appointment._id ? 'sm:hover:scale-100 sm:transition-all' : ''}
              `}
              onClick={() => handleCardClick(appointment._id)}
            >
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold">
                  {appointment.specialty.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2 text-sm sm:text-base">
                  <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{format(parseISO(appointment.appointmentDate), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center mb-2 text-sm sm:text-base">
                  <ClockIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{format(parseISO(appointment.appointmentDate), 'h:mm a')}</span>
                </div>
                <div className="flex items-center mb-2 text-sm sm:text-base">
                  <UserIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="truncate" title={appointment.doctorName}>
                    Doctor: {appointment.doctorName}
                  </span>
                </div>
                <div className="flex items-center mb-2 text-sm sm:text-base">
                  <HospitalIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="truncate" title={appointment.clinicName}>
                    Clinic: {appointment.clinicName}
                  </span>
                </div>
                <div className="mt-2 text-sm sm:text-base font-semibold">
                  Status: {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </div>
                <div className="hidden sm:block mt-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewAppointment(appointment._id);
                    }}
                    className="w-full text-sm sm:text-base"
                  >
                    View Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center p-4 border-t mt-auto">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-sm sm:text-base"
          variant="outline"
        >
          Previous
        </Button>
        <span className="text-sm sm:text-base">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || appointments.length === 0}
          className="text-sm sm:text-base"
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
