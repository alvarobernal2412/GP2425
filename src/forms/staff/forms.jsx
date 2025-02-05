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
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PasswordInput } from '@/components/forms/password-input';
import { specialtiesWithLabels } from '@/utils/utils';

export function RegisterStaffForm({ form, onSubmit, isLoading, error }) {

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-x-8 gap-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Surname</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dni"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">DNI</FormLabel>
              <FormControl>
                <Input placeholder="12345678A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start w-full">
              <FormLabel className="text-base font-large">Specialty</FormLabel>
              <FormControl className="w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full text-left">
                    <p className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                      {specialtiesWithLabels.find((s) => s.value === field.value)?.label}
                    </p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {specialtiesWithLabels.map((specialty) => (
                      <DropdownMenuItem
                        key={specialty.value}
                        onSelect={() => field.onChange(specialty.value)}
                      >
                        {specialty.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-base font-large">Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full lg:col-span-2" type="submit" disabled={isLoading}>
          {isLoading && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          <span className="text-base font-large">Register</span>
        </Button>
        {error && <FormMessage className="flex flex-col items-start text-base lg:col-span-2">{error}</FormMessage>}
      </form>
    </Form>
  );
}
