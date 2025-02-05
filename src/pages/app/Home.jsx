import { useAuth } from '@/hooks/use-auth';
import { DoctorSchedulePage } from '@/pages/app/DoctorSchedulePage';
import { Appointments } from '@/pages/app/Appointments';
import { ClinicaEdicion } from '@/pages/app/EditClinic';

export function Home() {
  const { userData } = useAuth();

  if (userData.roles.includes('doctor') || userData.roles.includes('clinicadmin')) {
    return <DoctorSchedulePage />;
  } else if (userData.roles.includes('patient')) {
    return <Appointments />;
  } else {
    return <ClinicaEdicion />;
  }
}
