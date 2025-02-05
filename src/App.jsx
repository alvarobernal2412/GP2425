import '@/styles/App.css';
import { ThemeProvider } from '@/components/theme-provider';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Landing } from '@/pages/Landing';
import { About } from '@/pages/About';
import { Home } from '@/pages/app/Home';
import { Login } from '@/pages/Login';
import { Logout } from '@/pages/Logout';
import { Verify2FA } from '@/pages/Verify2FA';
import { DoctorSchedulePage } from '@/pages/app/DoctorSchedulePage';
import PatientEditPage from '@/pages/app/PatientEdit';
import { Plans } from '@/pages/Plans';
import { SuccessPayment } from '@/pages/SuccessPayment';
import { Appointments } from '@/pages/app/Appointments';
import { AppointmentDetails } from '@/pages/app/AppointmentDetails';
import { ClinicalHistory } from '@/pages/app/ClinicalHistory';
import { Staff } from '@/pages/app/Staff';
import MainLayout from '@/layouts/MainLayout';
import AppLayout from '@/layouts/AppLayout';
import { RegisterStaff } from '@/pages/app/RegisterStaff';
import { SearchStaff } from '@/pages/app/SearchStaff';
import { AuthProvider } from '@/components/auth-provider';
import { ClinicCreation } from '@/pages/app/ClinicCreation';
import { ClinicaEdicion } from '@/pages/app/EditClinic';
import { ClinicaCompletada } from '@/pages/app/SuccessPage';
import { BookingSystem } from '@/pages/app/BookAppointment';
import { RegisterPatient } from '@/pages/app/RegisterPatient';
import { PacienteRegistrado } from '@/pages/app/SuccessPagePatient';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Landing />} />
              <Route path="about" element={<About />} />
            </Route>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="staff/:doctorId" element={<Staff />} />
              <Route path="staff/me" element={<Staff me={true} />} />
              <Route path="register-staff" element={<RegisterStaff />} />
              <Route path="calendar" element={<DoctorSchedulePage />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="appointments/:appointmentId" element={<AppointmentDetails />} />
              <Route path="appointments/:doctorId/book" element={<BookingSystem />} />
              <Route path="history/:id" element={<ClinicalHistory />} />
              <Route path="search-staff" element={<SearchStaff />} />
              <Route path="clinics/add" element={<ClinicCreation />} />
              <Route path="clinics/edit" element={<ClinicaEdicion />} />
              <Route path="clinics/success" element={<ClinicaCompletada />} />
              <Route path="patients/edit" element={<PatientEditPage />} />
              <Route path="patients/register-patient" element={<RegisterPatient />} />
              <Route path="patients/success" element={<PacienteRegistrado />} />
              <Route path="plans" element={<Plans />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/verify-2fa" element={<Verify2FA />} />
            <Route path="/success" element={<SuccessPayment />} />
            <Route path="/cancel" element={<Plans />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
