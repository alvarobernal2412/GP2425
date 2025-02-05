import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PasswordChange from '@/components/forms/password-change';
import { Enable2FA } from '@/components/enable-2fa';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { getDoctorData, updateSpecialty, deleteDoctor } from '@/services/staff';
import { getUserData } from '@/services/auth';
import { specialtiesWithLabels } from '@/utils/utils';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LoaderCircle } from 'lucide-react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export function Staff({ me }) {
  const { doctorId: paramDoctorId } = useParams();
  const [doctorId, setDoctorId] = useState(me ? '' : paramDoctorId);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [rolesFromProfile, setRolesFromProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorModal, setErrorModal] = useState('');
  const [noDoctor, setNoDoctor] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  useEffect(() => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    setRoles(userData.roles || []);
    setUserData(userData);
    me && setDoctorId(userData.doctorid);
  }, [me, paramDoctorId]);

  useEffect(() => {
    if (Object.keys(userData).length === 0) return;

    async function fetchDoctorData() {


      if (userData.doctorid === doctorId) {
        navigate('/app/staff/me', { me: true });
      }

      try {
        const data = await getDoctorData(doctorId);
        if (!me) {
          const dataAuth = await getUserData(data.userId);
          setEmail(dataAuth.email);
          setRolesFromProfile(dataAuth.roles);
        }
        setName(data.name);
        setSurname(data.surname);
        setSpecialty(data.specialty);
        setDni(data.dni);
        me && setRolesFromProfile(userData.roles);
        me && setEmail(userData.email);

      } catch (error) {
        console.error('Error fetching doctor data:', error);
        setNoDoctor(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctorData();
  }, [doctorId, me, userData, navigate, paramDoctorId]);

  const handleDeleteDoctor = async () => {
    try {
      setDeleteLoading(true);
      await deleteDoctor(doctorId);
      navigate('/app');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError('Error deleting doctor');
      setErrorModal('Error deleting doctor');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdateSpecialty = async (newSpecialty) => {
    setErrorModal('');
    try {
      setUpdateLoading(true);
      await updateSpecialty(doctorId, newSpecialty);
      setSpecialty(newSpecialty);
      setError('');
      setUpdateLoading(false);
    } catch (error) {
      console.error('Error updating specialty:', error);
      setError('Error updating specialty');
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <LoaderCircle className="animate-spin" />;
  }

  const getSpecialtyLabel = (value) => {
    const specialty = specialtiesWithLabels.find(s => s.value === value);
    return specialty ? specialty.label : value;
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">Doctor Details</h1>
      {noDoctor ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>This doctor does not exist</CardTitle>
          </CardHeader>
        </Card>
      ) : (
        name && surname && specialty && dni && (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Doctor Details</CardTitle>
              <CardDescription>Information about the doctor</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg"><strong>Name:</strong> Dr. {name}</p>
              <p className="text-lg"><strong>Surname:</strong> {surname}</p>
              <p className="text-lg"><strong>Email:</strong> {email}</p>
              <p className="text-lg"><strong>Specialty:</strong> {getSpecialtyLabel(specialty)}</p>
              {(me || roles.includes('clinicadmin')) && <p className="text-lg"><strong>DNI:</strong> {dni}</p>}
            </CardContent>
            {roles.includes('patient') && (
              <CardFooter className="flex justify-center items-center flex-wrap gap-4">
                <Button onClick={() => navigate(`/app/appointments/${doctorId}/book`)}>
                  Book an appointment
                </Button>
              </CardFooter>
            )}
            {roles.includes('clinicadmin') && (
              <CardFooter className="flex flex-wrap gap-4">
                {!rolesFromProfile.includes('clinicadmin') && (
                  <Button className="w-full lg:col-span-2" onClick={openModal} variant="destructive" disabled={deleteLoading}>
                    {deleteLoading && (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <span className="text-base font-large">Delete Doctor</span>
                  </Button>)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full lg:col-span-2" type="submit" disabled={updateLoading}>
                      {updateLoading && (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <span className="text-base font-large">Update specialty</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {specialtiesWithLabels.map(({ label, value }) => (
                      <DropdownMenuItem key={value} onSelect={() => handleUpdateSpecialty(value)}>
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            )}
            {error && <p className="flex justify-center items-center text-base text-red-500 pb-4">{error}</p>}
            {me &&
            <div className="flex flex-wrap gap-4 p-4 [&>*]:grow fit-content">
              <PasswordChange />
              <Enable2FA />
            </div>}
          </Card>
        )
      )}
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Confirm Delete"
          className="flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Delete Doctor</CardTitle>
              <CardDescription>Are you sure you want to delete this doctor? You cannot undo this action.</CardDescription>
            </CardHeader>

            <CardFooter className="flex gap-4 justify-center">
              <Button onClick={handleDeleteDoctor} variant="destructive" disabled={deleteLoading}>
                {deleteLoading && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                <span className="text-base font-large">Delete Doctor</span>
              </Button>
              <Button onClick={closeModal}>No</Button>
            </CardFooter>
            {errorModal && <p className="flex justify-center items-center text-base text-red-500 pb-4">{errorModal}</p>}
          </Card>
        </Modal>
      </div>
    </div>
  );
}
