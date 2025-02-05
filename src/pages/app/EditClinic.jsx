import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Edit, Save, X, LoaderCircle } from 'lucide-react';
import { getClinicById, updateClinic, getDoctorById,getPlanById } from '@/services/payments';
import { getDoctorsBySpeciality } from '@/services/staff';
import { useAuth } from '@/hooks/use-auth';

function ClinicForm({ clinica, editando, errors, onChange, onCancel, onSubmit, nombre }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {['name', 'city', 'district', 'postalCode'].map((field) => (
        <div key={field}>
          <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
          {editando ? (
            <Input
              type="text"
              id={field}
              name={field}
              value={clinica[field]}
              onChange={onChange}
              className={errors[field] ? 'border-red-500' : ''}
            />
          ) : (
            <p className="mt-1">{clinica[field]}</p>
          )}
          {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
        </div>
      ))}
      <div>
        <Label htmlFor="plan">Plan</Label>
        <p className="mt-1">{nombre}</p>
      </div>
    </form>
  );
}

function DoctorsList({ doctors, onCardClick }) {
  return (
    <Card className="w-full max-w-md mt-4">
      <CardHeader>
        <CardTitle>Doctors List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 w-full">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <Card
                key={doctor._id}
                className="carddoctor w-full cursor-pointer"
                onClick={() => onCardClick(doctor._id)}
              >
                <CardHeader>
                  <CardTitle>{doctor.name} {doctor.surname}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Specialty: {doctor.specialty}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No doctors available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ClinicaEdicion({ clinicaInicial = {} }) {
  const [clinica, setClinica] = useState(clinicaInicial);
  const [ID_Clinica, setIdClinica] = useState(null);
  const [planName, setPlanName] = useState(null);
  const [editando, setEditando] = useState(false);
  const [errors, setErrors] = useState({});
  const clinicaInicialRef = useRef(null);
  const [doctors, setDoctors] = useState([]);
  const [isReady, setIsReady] = useState(false); // Estado para sincronizar cargas
  const navigate = useNavigate();
  const { userData } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClinica((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Sincronizar todas las llamadas
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Obtener el ID de la clínica desde el doctor
        const doctorResponse = await getDoctorById(userData.doctorid);
        const clinicId = doctorResponse.data.clinicId;
        setIdClinica(clinicId);

        // Obtener los datos de la clínica
        const clinicResponse = await getClinicById(clinicId);
        setClinica(clinicResponse.data);
        clinicaInicialRef.current = clinicResponse.data;

        // Obtener los doctores de la clínica
        const doctorsResponse = await getDoctorsBySpeciality({ clinicId });
        setDoctors(doctorsResponse.data);
        // Obtener el nombre del plan
        if (clinicResponse.data.plan) {
          const planResponse = await getPlanById(clinicResponse.data.plan);
          setPlanName(planResponse.data.name);
        }

        // Marcar como listo
        setIsReady(true);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchAllData();
  }, [userData.doctorid]);

  const validateForm = () => {
    const newErrors = {};
    ['name', 'city', 'district', 'postalCode'].forEach((field) => {
      if (!clinica[field]?.trim()) newErrors[field] = `${field} es requerido`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await updateClinic(ID_Clinica, clinica);
        setEditando(false);
      } catch (error) {
        console.error('Error al actualizar la clínica:', error);
      }
    }
  };

  const handleCancel = () => {
    setClinica(clinicaInicialRef.current || clinicaInicial);
    setEditando(false);
    setErrors({});
  };

  const handleCardClick = (doctorId) => navigate(`/app/staff/${doctorId}`);

  if (!isReady) {
    return <LoaderCircle className="animate-spin" />;
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <Card className="w-full max-w-2xl mx-auto h-fit">
        <CardHeader>
          <CardTitle>Clinic Information</CardTitle>
          <CardDescription>View and edit your clinic details</CardDescription>
        </CardHeader>
        <CardContent>
          <ClinicForm
            clinica={clinica}
            editando={editando}
            errors={errors}
            onChange={handleChange}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            nombre={planName}
          />
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          {editando ? (
            <>
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={() => setEditando(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button type="button" onClick={() => navigate('/app/plans')}>
                <Edit className="mr-2 h-4 w-4" /> Update plan
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <DoctorsList doctors={doctors} onCardClick={handleCardClick} />
    </div>
  );
}
