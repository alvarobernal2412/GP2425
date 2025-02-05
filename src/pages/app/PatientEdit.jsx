import { useState, useEffect, useRef } from 'react';
import PatientEdit from '@/forms/patient/formsEdit';
import PasswordChange from '@/components/forms/password-change';
import { Enable2FA } from '@/components/enable-2fa';
import { getPatientById, updatePatient } from '@/services/patient';
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ClipboardPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PatientEditPage({ initialPatient = {} }) {
  const [patient, setPatient] = useState(initialPatient);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const initialPatientRef = useRef(null);
  const { userData } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatientById(userData.patientid);
        const data = response.data;
        if (data.birthdate) {
          data.birthdate = format(new Date(data.birthdate), 'yyyy-MM-dd');
        }
        setPatient(data);
        initialPatientRef.current = data;
      } catch (error) {
        console.error('Error al obtener el paciente:', error);
      }
    };

    fetchPatient();
  }, [userData.patientid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const validateDNI = (dni) => {
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    if (!dniRegex.test(dni)) {
      return false;
    }
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const number = dni.slice(0, 8);
    const letter = dni.slice(8, 9);
    return letters[parseInt(number) % 23] === letter;
  };

  const validateForm = () => {
    let newErrors = {};
    if (!patient.name) newErrors.name = 'The name is required';
    if (!patient.surname) newErrors.surname = 'The surname is required';
    if (!patient.birthdate) newErrors.birthdate = 'The birthdate is required';
    if (!patient.dni) newErrors.dni = 'The DNI is required';
    else if (!validateDNI(patient.dni)) newErrors.dni = 'The DNI is not valid';
    if (!patient.city) newErrors.city = 'The city is required';    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updatePatient(userData.patientid, patient)
        .then(() => {
          console.log('Paciente actualizado con éxito');
        })
        .catch((error) => {
          console.error('Error al actualizar el paciente:', error);
        });
      setIsEditing(false);
    } else {
      console.log('Formulario inválido');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setPatient(initialPatientRef.current);
    setIsEditing(false);
    setErrors({});
  };

  return (
    <Card className="w-full max-w-md lg:min-w-[600px] rounded-lg shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between rounded-lg shadow-sm">
          <CardTitle>Edit Patient</CardTitle>
          <div className='flex items-center space-x-3 ml-auto'> 
            <Button className="px-3 py-2 gap-2 text-base ml-auto hover:text-muted-foreground" onClick={() => navigate(`/app/history/${patient._id}`)}>
              <ClipboardPlus className="h-4 w-4" />
              Clinical History
            </Button>
          </div>
        </div>
        <CardDescription className="text-left">Edit patient details</CardDescription>
      </CardHeader>
      <CardContent>
        <PatientEdit
          patient={patient}
          isEditing={isEditing}
          handleEdit={handleEdit}
          handleCancel={handleCancel}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          error={errors}
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-4 p-4 [&>*]:grow fit-content">
        <PasswordChange />
        <Enable2FA />
      </CardFooter>
    </Card>
  );
}

export default PatientEditPage;
