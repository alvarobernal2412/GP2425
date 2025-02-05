import { RegisterPatientForm } from '@/forms/patient/formsCreate';
import { registerPatientSchema } from '@/forms/patient/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { registerPatient } from '@/services/patient';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

export function RegisterPatient() {
    
  return (
    <div className="w-full flex items-center justify-center p-8">
      <RegisterPatientCard />
    </div>
  );
}

function RegisterPatientCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registerPatientSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      surname: '',
      city: '',
      dni: '',
      birthdate: '',
      username:'',
    },
  });

  function onSubmit(values) {
    setIsLoading(true);
    registerPatient(values)
      .then((response) => {

        if (response.status === 201)
          navigate('/app/patients/success');
      })
      .catch((err) => {
        
        if (err.response && err.response.status === 400) {
          setError('A patient with the same DNI or Email already exists');
        } else if ((err.response && err.response.status === 401) || (err.response && err.response.status === 403)) {
          setError('You must be logged in as a admin or doctor to register Patient');
        } else {
          setError('An error occurred. Please try again later.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Card className="w-full max-w-md lg:min-w-[600px] rounded-lg shadow-sm">
      <CardHeader className="items-start">
        <CardTitle>Register Patient</CardTitle>
        <CardDescription>Register new patient</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterPatientForm form={form} onSubmit={onSubmit} isLoading={isLoading} error={error} />
      </CardContent>
    </Card>
  );
}