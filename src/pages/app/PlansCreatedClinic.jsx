import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { obtainPlans } from '@/services/payments';

export function PlansCreatedClinic({ onSelectPlan, selectedPlan }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleSelect = (planId) => {
    onSelectPlan(planId);
  };

  if (loading) {
    return <div className="text-center">Loading plans...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose your Plan</h2>
      <p className="text-center mb-8 text-muted-foreground">
        Select the plan that best suits the needs of your clinic.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan._id} className={`flex flex-col ${selectedPlan === plan._id ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>${plan.price.toFixed(2)} / mes</CardDescription>
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
                type="button"
                className="w-full"
                onClick={() => handleSelect(plan._id)}
                variant={selectedPlan === plan._id ? 'secondary' : 'default'}
              >
                {selectedPlan === plan._id ? 'Seleccionado' : 'Elegir Plan'}
              </Button>


            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}


