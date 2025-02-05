import { Bandage, Activity, Cross, HeartPulse, HandHeart, CalendarHeart, Syringe, Tablets, Stethoscope, Dna, Brain } from 'lucide-react';
import { LoginForm } from '@/forms/auth/forms';
import { loginSchema } from '@/forms/auth/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PulsingIcons from '@/components/pulsing-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

export function Login() {
  const icons = {
    Bandage,
    Activity,
    Cross,
    HeartPulse,
    HandHeart,
    CalendarHeart,
    Syringe,
    Tablets,
    Stethoscope,
    Dna,
    Brain,
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Graphic */}
      <div className="flex w-0 lg:w-1/3 relative duration-200 transition-width ease-linear">
        <PulsingIcons icons={icons} className="overflow-hidden fixed w-0 lg:w-1/3 inset-x-0 min-h-screen bg-sidebar border-r ring-r" />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8">
        <LoginCard />
      </div>
    </div>
  );
}

function LoginCard() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'a',
      password: 'a',
    },
  });

  function onSubmit() {
    console.log('submit');
    navigate('/app');
  }

  return (
    <Card className="w-full max-w-md rounded-lg shadow-sm">
      <CardHeader className="items-start">
        <CardTitle>Log In</CardTitle>
        <CardDescription>Log In to CloudMedix</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm form={form} onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
}