import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import logo from '@/assets/cloudmedix.png';
import { Calendar, Users, FileText, Shield } from 'lucide-react';

export function Landing() {
  const isMobile = useIsMobile();

  const plans = [
    {
      plan: 'Basic',
      clinics: 1,
      doctors: 2,
      patients: 350,
      format: 'PDF (20MB max)',
      fileSizes: '20MB max',
      price: '€0.0/month per user',
      addons: [
        {
          name: '+Doctors and +Patients',
          description: 'Add-On to buy more doctors and patients',
          availableFor: 'BASIC',
          price: '€9.99 / user per month',
          features: {
            doctorsPerClinic: true,
            patientsPerClinic: true,
          },
          usageLimits: {
            maxDoctorsPerClinic: '+1 doctor',
            maxPatientsPerClinic: '+100 patients',
          },
        },
      ],
    },
    {
      plan: 'Advanced',
      clinics: 3,
      doctors: 15,
      patients: 1000,
      format: 'PDF, CSV, XML, JSON',
      fileSizes: '1GB max',
      price: '€5.0/month per user',
      addons: [],
    },
    {
      plan: 'Professional',
      clinics: 6,
      doctors: 35,
      patients: 5000,
      format: 'PDF, CSV, XML, JSON, DICOM, HL7, FHIR',
      fileSizes: '10GB max',
      price: '€10.0/month per user',
      addons: [
        {
          name: 'Reminder Service',
          description: 'Add-On to enable patient appointment reminders',
          availableFor: 'PROFESSIONAL',
          price: '€29.99 / user per month',
        },
      ],
    },
    {
      plan: 'Enterprise',
      clinics: 'Unlimited',
      doctors: 'Unlimited',
      patients: 'Unlimited',
      format: 'All formats',
      price: 'Contact us',
      addons: [],
    },
  ];

  return (
    <div className="flex flex-col items-center mb-16">
      <div className="flex justify-around mt-16">
        <a href="" target="_blank">
          <img src={logo} className="logohome size-l" alt="CloudMedix logo" />
        </a>
      </div>
      <div className="card flex flex-col justify-center items-center gap-y-3">
        <div className="rounded-lg p-4 mb-8">
          <p className="text-primary max-w-screen-lg mx-auto text-center text-pretty">
            <strong className="text-lg">CloudMedix</strong> is a cutting-edge, cloud-native platform designed to revolutionize clinic management. Our microservices-based architecture enables healthcare providers to efficiently handle patient appointments, manage multiple medical specialties, and maintain detailed patient histories. With real-time scheduling, secure access to clinical data, and seamless communication between doctors, patients, and clinic staff, CloudMedix empowers healthcare professionals to deliver superior patient care.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Calendar className="w-10 h-10 text-blue-500 mb-2" />
              <CardTitle>Real-time Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Efficiently manage patient appointments across multiple specialties.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Users className="w-10 h-10 text-green-500 mb-2" />
              <CardTitle>Multi-specialty Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Seamlessly handle various medical specialties within a single platform.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center">
              <FileText className="w-10 h-10 text-purple-500 mb-2" />
              <CardTitle>Detailed Patient History</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Maintain comprehensive patient records for improved care continuity.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Shield className="w-10 h-10 text-red-500 mb-2" />
              <CardTitle>Secure Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Ensure data privacy with secure access controls for clinical information.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="w-8/12 my-8 border-t-2 border-black-200"></div>
      <h1 className="text-3xl font-bold mb-6">Pricing</h1>
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-4'} gap-7`}>
        {plans.map((plan) => (
          <Card key={plan.plan} className="flex flex-col justify-between p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-65">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4">{plan.plan} Plan</CardTitle>
              <CardDescription className="text-lg mb-4">{plan.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-8">
                <li>{plan.clinics} Clinics</li>
                <li>{plan.doctors} Doctors/Clinic</li>
                <li>{plan.patients} Patients/Clinic</li>
                <li>Format: {plan.format}</li>
                <li>Max File Size: {plan.fileSizes}</li>
              </ul>
              {plan.addons.length > 0 && (
                <div className="text-sm">
                  <h3 className="text-xl font-bold mb-2">Add-Ons</h3>
                  {plan.addons.map((addon) => (
                    <div key={addon.name} className="mb-4">
                      <span className="font-semibold">{addon.name}</span>
                      <p>{addon.description}</p>
                      <p>Precio: {addon.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center items-center mt-auto">
              <a href="" target="_blank">
                <Button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                  Contact Us
                </Button>
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
