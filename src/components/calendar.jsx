import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, format, isToday, isSameDay } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { ScheduleCard } from '@/components/schedule-card';
import { AppointmentCard } from '@/components/appointment-card';


export function Calendar({ onDateSelect, onScheduleSelect, onAppointmentSelect, schedules, appointments, currentWeek, onWeekChange }) {
  const nextWeek = () => onWeekChange(addWeeks(currentWeek, 1));
  const prevWeek = () => onWeekChange(subWeeks(currentWeek, 1));

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const timeSlots = Array.from({ length: 16 }, (_, i) => 7 + i * 1);

  const getScheduleForDay = (day) => {
    return schedules
      .filter(schedule => isSameDay(schedule.date, day))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getAppointmentsForDay = (day) => {
    return appointments
      .filter(appointment => isSameDay(appointment.date, day))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };
  
  return (
    <div className="flex flex-col w-full flex-grow h-full overflow-x-auto overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={prevWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-semibold">
          {format(weekStart, "'Week of' MMMM d", { locale: enGB })} - {format(weekEnd, 'MMMM d', { locale: enGB })} ({format(weekEnd, 'yyyy', { locale: enGB })})
        </h2>
        <Button variant="outline" size="icon" onClick={nextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-8 gap-0 h-full w-full overflow-y-auto">
        <div className="sticky left-0 bg-background z-20"></div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`flex flex-col text-center font-medium p-2 bg-muted border-l border-gray-200 ${
              isToday(day) ? 'font-bold' : ''
            }`}
          >
            <div className="hidden lg:block">{format(day, 'EEEE')}</div>
            <div className="lg:hidden">{format(day, 'E')[0]}</div>
            <div className={`text-sm ${isToday(day) ? 'font-bold' : ''}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
        {timeSlots.map((hour) => (
          <React.Fragment key={hour}>
            <div className="border-t border-dashed border-gray-200 border-l border-gray-200">
              {`${hour}:00`}
            </div>
            {days.map((day) => (
              <div
                key={`${day}-${hour}`}
                className="relative h-24 border-t border-dashed border-gray-200 border-l border-gray-200"
                onClick={() => onDateSelect(day, hour)}
              >
                {hour === 7 && getScheduleForDay(day).map((schedule, index) => (
                  <ScheduleCard
                    key={index}
                    date={schedule.date}
                    startTime={schedule.startTime}
                    endTime={schedule.endTime}
                    onClick={(e) => {
                      e.stopPropagation();
                      onScheduleSelect(schedule);
                    }}
                  />
                ))}
                {hour === 7 && getAppointmentsForDay(day).map((appointment, index) => (
                  <AppointmentCard
                    key={index}
                    date={appointment.date}
                    patientId={appointment.patientId}
                    startTime={appointment.startTime}
                    endTime={appointment.endTime}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentSelect(appointment);
                    }}
                  />
                ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
