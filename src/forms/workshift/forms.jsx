import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { es } from 'date-fns/locale';
import { DatePicker } from '@/components/ui/date-picker';
import { CustomTimePicker as TimePicker } from '@/components/ui/time-picker';
import { useState } from 'react';

export function WorkshiftForm({ form, onSubmit, selectedDate, startTime, setStartTime, endTime, setEndTime, existingSchedule, isLoading, error, setSelectedDate }) {
  const [dateForm, setDateForm] = useState(selectedDate);

  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="date">Selected Date</FormLabel>
              <br />
              <FormControl>
                <DatePicker
                  key={selectedDate}
                  id="date"
                  selected={dateForm}
                  onSelect={(date) => { 
                    form.setValue('date', date);
                    setSelectedDate(date);
                    setDateForm(date);
                  }}
                  dateFormat="dd/MM/yyyy"
                  locale={es}
                  className="w-full"
                  placeholderText="Select a date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="startTime">Start Time</FormLabel>
              <FormControl>
                <TimePicker
                  id="startTime"
                  value={field.value || startTime}
                  onChange={(time) => {
                    setStartTime(time);
                    form.setValue('startTime', time);
                  }}
                  label="Start Time"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="endTime">End Time</FormLabel>
              <FormControl>
                <TimePicker
                  id="endTime"
                  value={field.value || endTime}
                  onChange={(time) => {
                    setEndTime(time);
                    form.setValue('endTime', time);
                  }}
                  label="End Time"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          {existingSchedule ? 'Update Schedule' : 'Save Schedule'}
        </Button>
        {error && <FormMessage className="text-base">{error}</FormMessage>}
      </form>
    </Form>
  );
}
