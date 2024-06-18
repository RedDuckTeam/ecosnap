import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useGetEventById } from '@/hooks/queries/use-get-event-by-id';

export default function Event() {
  const { id } = useParams() as { id: string | undefined };
  const { data: city, isLoading } = useGetEventById(id);
  const navigate = useNavigate();

  const onBack = useCallback(() => {
    navigate('/events');
  }, [navigate]);

  if (isLoading) {
    return (
      <main className="container flex items-center justify-between p-12">
        <Loader2 className="animate-spin h-8 w-8" />
      </main>
    );
  }

  if (!city) {
    return (
      <main className="container flex items-center justify-between p-12">
        <p>Event not found.</p>
      </main>
    );
  }

  return (
    <main className="container flex flex-col gap-12">
      <Button variant="outline" onClick={onBack} className="w-fit">
        Back
      </Button>
      <h1 className="text-4xl font-bold">{city.name}</h1>
      <p>{city.description}</p>
    </main>
  );
}
