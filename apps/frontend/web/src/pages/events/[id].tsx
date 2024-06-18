import { PublicKey } from '@solana/web3.js';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { ArrowCircleLeft } from '@/components/icons/arrow-circle-left';
import { Calendar } from '@/components/icons/calendar';
import { Clock } from '@/components/icons/clock';
import { Events } from '@/components/icons/events';
import { Button } from '@/components/ui/button';
import { KeepOpenOnActivation } from '@/components/ui/tooltip';
import { useGetCities } from '@/hooks/queries/use-get-cities';
import { useGetEventById } from '@/hooks/queries/use-get-event-by-id';
import { useGetParticipants } from '@/hooks/queries/use-get-participants';
import { generateBlockies } from '@/lib/blockies';
import { formatDate } from '@/lib/utils';
import { routes } from '@/router';

export default function Event() {
  const { id } = useParams() as { id: string | undefined };
  const { data: city, isLoading } = useGetEventById(id);
  const { data: cities } = useGetCities();

  const { data: participants } = useGetParticipants(id);

  const location = useMemo(() => {
    if (!city) return null;

    return cities?.find((c) => c.id === city.city)?.name ?? null;
  }, [cities, city]);

  if (isLoading) {
    return (
      <main className="container ">
        <div className=" xl:ml-[268px] flex items-center justify-between p-12">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      </main>
    );
  }

  if (!city) {
    return (
      <main className="container ">
        <div className=" xl:ml-[268px] flex items-center justify-between p-12">
          <p>Event not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container ">
      <div className="flex flex-col xl:ml-[268px]">
        <div className="flex mb-8 items-center justify-between">
          <div className="w-5">
            <NavLink to={routes.events}>
              <ArrowCircleLeft />
            </NavLink>
          </div>
          <h1 className="text-[18px] font-semibold">{city.name}</h1>
          <div className="w-5"></div>
        </div>
        <img
          src="https://media.istockphoto.com/id/585779866/photo/blue-pearl-capital-city-austin-texas.jpg?s=612x612&w=0&k=20&c=rwtyB3br8j659kTbQyHdCJUO2O1UnzwMyXaZ-HcNV4c="
          alt={city.name}
          className="rounded-[20px] mb-4"
        />
        <div className="rounded-[16px] bg-gray-blue p-4 flex gap-2 items-center flex-wrap mb-6">
          <div className="flex gap-1.5 items-center">
            <Calendar />
            {formatDate(new Date(city.eventStartsAt as number))}
          </div>
          <div className="flex gap-1.5 items-center">
            <Clock />
            {formatDate(new Date(city.eventStartsAt as number))}
          </div>
          {location && (
            <div className="flex gap-1.5 items-center">
              <Events className="[&_path]:fill-primary w-6 h-4 " />
              {location}
            </div>
          )}
        </div>
        <p className="text-gray font-medium text-[14px] mb-6">{city.description}</p>
        <div className="flex justify-center mb-4">
          <Button className="py-2">Participate</Button>
        </div>
        {participants && participants.length > 0 && (
          <div className="flex flex-col gap-4">
            <h6 className="text-[16px] font-semibold">Participants</h6>
            <div className="flex gap-2 flex-wrap">
              {participants.map((participant) => (
                <div>
                  <KeepOpenOnActivation
                    trigger={generateBlockies(new PublicKey(participant.address), 14)}
                    content={<p className="text-[16px] font-semibold">{participant.address}</p>}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
