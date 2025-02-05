import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { Textarea } from '@/components/history';

export function ConditionForm({ form, onSubmit, isLoading, error }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <FormMessage className="flex flex-col items-start text-base">{error}</FormMessage>}
        <FormField
          control={form.control}
          name="name"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Name *</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} maxLength={50}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Details *</FormLabel>
              <FormControl>
                <Textarea placeholder="Details" {...field} maxLength={120}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="since"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Since *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="until"
          rules={{ required: false }}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Until</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          <span className="text-base font-large">Save</span>
        </Button>
      </form>
    </Form>
  );
}

export function TreatmentForm({ form, onSubmit, isLoading, error }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <FormMessage className="flex flex-col items-start text-base">{error}</FormMessage>}
        <FormField
          control={form.control}
          name="name"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Name *</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} maxLength={50}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Instructions *</FormLabel>
              <FormControl>
                <Textarea placeholder="Instructions" {...field} maxLength={120}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Start date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">End date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          <span className="text-base font-large">Save</span>
        </Button>
      </form>
    </Form>
  );
}

export function FileForm({ form, onSubmit, isLoading, error, onChange, fileSelected }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <FormMessage className="flex flex-col items-start text-base">{error}</FormMessage>}
        <FormField
          control={form.control}
          name="file"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">File *</FormLabel>
              <FormControl>
                <Input type="file" onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading || !fileSelected}>
          {isLoading && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          <span className="text-base font-large">Upload</span>
        </Button>
      </form>
    </Form>
  );
}

export function AllergyForm({form, onSubmit, isLoading, error}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <FormMessage className="flex flex-col items-start text-base">{error}</FormMessage>}
        <FormField
          control={form.control}
          name="allergy"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Name *</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} maxLength={50}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          <span className="text-base font-large">Save</span>
        </Button>
      </form>
    </Form>
  );
}