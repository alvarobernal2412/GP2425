import { Bandage, Activity, Cross, HeartPulse, HandHeart, CalendarHeart, Syringe, Tablets, Stethoscope, Dna, Brain } from 'lucide-react';
import { Verify2FAForm } from '@/forms/auth/forms';
import { verify2FASchema } from '@/forms/auth/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PulsingIcons from '@/components/pulsing-icons';
import { verify2FA } from '@/services/auth';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/use-auth';

export function Verify2FA() {
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

      {/* Right side - Verify2FA Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8">
        <Verify2FACard />
      </div>
    </div>
  );
}

function Verify2FACard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || { userId: null };
  const { authenticate } = useAuth();

  const form = useForm({
    resolver: zodResolver(verify2FASchema),
    defaultValues: {
      totpToken: '',
    },
  });

  function onSubmit(values) {
    setIsLoading(true);
    verify2FA(userId, values)
      .then(async (response) => {
        if (response.status === 200 && response.data.message === 'Login successful') {
          const { message: _, ...userData } = response.data;
          await authenticate(userData);
          navigate('/app');
        }
      })
      .catch((err) => {
        if (err.response) {
          const { status, data } = err.response;

          if (status === 403) {
            setError(data.message || '2FA session expired or invalid');
          } else if (status === 400) {
            setError(data.message || 'Invalid 2FA token');
          } else {
            setError('An error occurred. Please try again later.');
          }
        } else {
          setError('Network error. Please try again later.');
        }
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Card className="w-full max-w-md rounded-lg shadow-sm">
      <CardHeader className="items-start">
        <CardTitle>Almost there!</CardTitle>
        <CardDescription>Open your 2FA app and enter the 6-digit code</CardDescription>
      </CardHeader>
      <CardContent>
        <Verify2FAForm form={form} onSubmit={onSubmit} isLoading={isLoading} error={error} />
      </CardContent>
    </Card>
  );
}
