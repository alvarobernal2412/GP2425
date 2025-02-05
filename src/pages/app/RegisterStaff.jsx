import { RegisterStaffForm } from '@/forms/staff/forms';
import { registerStaffSchema } from '@/forms/staff/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { registerStaff } from '@/services/staff';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

export function RegisterStaff() {
    
  return (
    <div className="w-full flex items-center justify-center p-8">
      <RegisterStaffCard />
    </div>
  );
}

function RegisterStaffCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registerStaffSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      surname: '',
      specialty: '',
      dni: '',
    },
  });

  function onSubmit(values) {
    setIsLoading(true);
    registerStaff(values)
      .then((response) => {

        if (response.status === 201)
          navigate('/app');
      })
      .catch((err) => {
        
        if (err.response && err.response.status === 400) {
          setError('A doctor with the same DNI or Email already exists');
        } else if (err.response && err.response.status === 403) {
          setError(err.response.data.message);
        } else {
          setError('An error occurred. Please try again later.');
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Card className="w-full max-w-md lg:min-w-[600px] rounded-lg shadow-sm">
      <CardHeader className="items-start">
        <CardTitle>Register Staff</CardTitle>
        <CardDescription>Register new staff member</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterStaffForm form={form} onSubmit={onSubmit} isLoading={isLoading} error={error} />
      </CardContent>
    </Card>
  );
}