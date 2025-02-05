import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Check } from 'lucide-react';
import { obtainPlans, registerPayment } from '@/services/payments';

export function Plans() {
  const [plans, setPlans] = useState([]);
  const { userData } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPlans = async () => {
    try {
      const response = await obtainPlans();
      const data = await response.data;
      setPlans(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      var urlStripe = await registerPayment({ planId: selectedPlan, clinicId: userData.clinicId });
    } catch (error) {
      console.error('Error submitting payment:', error);
      setError('Failed to register payment. Please try again.');
    } finally {
      setIsSubmitting(false);
      window.location.href = urlStripe;
    }
  };

  if (loading) {
    return <div className="text-center">Loading plans...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose Your Plan</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Select the plan that best fits your clinic&apos;s needs
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan._id} className={`flex flex-col ${selectedPlan === plan._id ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>${plan.price.toFixed(2)} / month</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSelectPlan(plan._id)}
                variant={selectedPlan === plan._id ? 'secondary' : 'default'}
                disabled={isSubmitting}
              >
                {selectedPlan === plan._id ? 'Selected' : 'Choose Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button 
        type="submit" 
        className="w-full mt-8" 
        onClick={handleSubmit} 
        disabled={!selectedPlan || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          'Next'
        )}
      </Button>
    </div>
  );
}