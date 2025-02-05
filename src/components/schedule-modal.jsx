import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { WorkshiftForm } from '@/forms/workshift/forms';
import { WorkshiftFormSchema } from '@/forms/workshift/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createWorkshift, updateWorkshift } from '@/services/workshift';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export function ScheduleModal({ isOpen, onClose, selectedDate, selectedHour, onSave, onDelete, existingSchedule, setSelectedDate }) {
  const [startTime, setStartTime] = useState(existingSchedule?.startTime || `${selectedHour.toString().padStart(2, '0')}:00`);
  const [endTime, setEndTime] = useState(existingSchedule?.endTime || `${(selectedHour + 1).toString().padStart(2, '0')}:00`);
  const { userData } = useAuth();

  useEffect(() => {
    if (existingSchedule) {
      setStartTime(existingSchedule.startTime);
      setEndTime(existingSchedule.endTime);
    } else {
      setStartTime(`${selectedHour.toString().padStart(2, '0')}:00`);
      setEndTime(`${(selectedHour + 1).toString().padStart(2, '0')}:00`);
    }
  }, [existingSchedule, selectedHour]);


  const handleSubmit = (data) => {
    const doctorId = userData.doctorid;
    const clinicId = userData.clinicId;
    const { date, startTime, endTime } = data;
    if (existingSchedule)  {
      updateWorkshift({ id: existingSchedule.id, date, startTime, endTime, clinicId }).then((updatedSchedule) => {
        onSave(updatedSchedule);
        onClose();
      });
    } else{
      createWorkshift({ date, startTime, endTime, doctorId, clinicId }).then((newSchedule) => {
        onSave(newSchedule);
        onClose();
      });
    }
  };

  const form = useForm({
    resolver: zodResolver(WorkshiftFormSchema),
    defaultValues: {
      date: selectedDate,
      startTime,
      endTime,
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>
              {existingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
            </DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <WorkshiftForm form={form} onSubmit={form.handleSubmit(handleSubmit)} selectedDate={selectedDate} startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} existingSchedule={existingSchedule} setSelectedDate={setSelectedDate} />
        {existingSchedule && (
          <Button onClick={onDelete} variant="destructive">Delete Schedule</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
