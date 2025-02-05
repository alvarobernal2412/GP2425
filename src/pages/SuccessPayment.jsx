import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function SuccessPayment() {
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate('/app');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-2">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <CardTitle className="text-2xl font-bold text-center">
            The payment has been made successfully.
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button onClick={handleAccept}>Accept</Button>
        </CardFooter>
      </Card>
    </div>
  );
}