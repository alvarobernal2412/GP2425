import { DoctorSchedulePage } from '@/pages/app/DoctorSchedulePage';
import { Appointments } from '@/pages/app/Appointments';
import { ClinicaEdicion } from '@/pages/app/EditClinic';
import userData from '@/utils/userData';

export function Home() {
  if (userData.roles.includes('doctor') || userData.roles.includes('clinicadmin')) {
    return <DoctorSchedulePage />;
  } else if (userData.roles.includes('patient')) {
    return <Appointments />;
  } else {
    return <ClinicaEdicion />;
  }
}
