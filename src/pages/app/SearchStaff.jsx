import { useState, useEffect } from 'react';
import { getDoctorsBySpeciality } from '@/services/staff';
import { getAllClinics } from '@/services/payment';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { specialtiesWithLabels } from '@/utils/utils';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';

export function SearchStaff() {
  const [clinicId, setClinicId] = useState(''); 
  const [speciality, setSpeciality] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState('');
  const [showDoctors, setShowDoctors] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllClinics()
      .then((response) => {
        setClinics(response.data);
        setLoadingClinics(false);
      })
      .catch((error) => {
        console.error('Error fetching clinics:', error);
        setLoadingClinics(false);
      });
  }, []);

  const handleSearch = async () => {
    if (!clinicId) {
      setError('Clinic is required'); 
      setShowDoctors(false);
      return;
    }
    try {
      setLoadingDoctors(true);
      const doctorsResponse = await getDoctorsBySpeciality({ clinicId, speciality });
      setDoctors(doctorsResponse.data);
      setError(''); 
    } catch (error) {
      setDoctors([]);
      setLoadingDoctors(false);   
      setError(error.response.data.message); 
      setShowDoctors(false);
      console.error(error); 
    } finally{
      setShowDoctors(true);
      setLoadingDoctors(false);
    }
  };

  const handleCardClick = (doctorId) => {
    navigate(`/app/staff/${doctorId}`);
  };

  const cardDoctors = () => {
    return (
      <Card className="w-full max-w-md mt-4">
        <CardHeader>
          <CardTitle>Doctors List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 w-full">
            {doctors.length > 0 && (doctors.map((doctor) => {
              return (
                <Card key={doctor._id} className="carddoctor w-full cursor-pointer" onClick={() => handleCardClick(doctor._id)}>
                  <CardHeader>
                    <CardTitle>{doctor.name} {doctor.surname}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Specialty: {specialtiesWithLabels.find(s => s.value === doctor.specialty)?.label}</p>
                  </CardContent>
                </Card>);
            }))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Doctors</h1>
      <div className="flex justify-center mb-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2 mb-4">
              <div className="w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full text-left">
                    <p className="flex h-9 w-3/4 mx-auto rounded-md border border-input bg-transparent px-2 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                      {clinics.find((clinic) => clinic._id === clinicId)?.name || 'Select Clinic'}
                    </p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {loadingClinics ? (
                      <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                    ) : (
                      clinics.map((clinic) => (
                        <DropdownMenuItem
                          key={clinic._id}
                          onSelect={() => {
                            setClinicId(clinic._id);
                          }}
                        >
                          {clinic.name}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full text-left">
                    <p className="flex h-9 w-3/4 mx-auto rounded-md border border-input bg-transparent px-2 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                      {specialtiesWithLabels.find((s) => s.value === speciality)?.label || 'Select Speciality'}
                    </p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {specialtiesWithLabels.map((specialty) => (
                      <DropdownMenuItem
                        key={specialty.value}
                        onSelect={() => setSpeciality(specialty.value)}
                      >
                        {specialty.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-lg" disabled={loadingDoctors}>
              {loadingDoctors && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span className="text-base font-large">Search</span>
            </Button>
          </CardContent>
        </Card>
      </div>
      {showDoctors && doctors?.length > 0 && (
        <div className="flex justify-center">
          {cardDoctors()}
        </div>
      )}
    </div>
  );
}