import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function PacienteRegistrado() {
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate('/app'); // Redirige a la página principal
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center space-y-2">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <CardTitle className="text-2xl font-bold text-center">
          Patient created correctly
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center">
          The patient has been successfully registered in our system.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleAccept}>Next</Button>
      </CardFooter>
    </Card>
  );
}
