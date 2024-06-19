import { PublicKey } from '@solana/web3.js';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { ArrowCircleLeft } from '@/components/icons/arrow-circle-left';
import { Calendar } from '@/components/icons/calendar';
import { Clock } from '@/components/icons/clock';
import { Events } from '@/components/icons/events';
import { User } from '@/components/icons/user';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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

  const [participateOpen, setParticipateOpen] = useState(false);
  const [code, setCode] = useState('');
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
      <Dialog onOpenChange={setParticipateOpen} open={participateOpen}>
        <DialogContent>
          <h1 className="text-[18px] font-bold">Enter code</h1>
          <Input value={code} onChange={(e) => setCode(e.target.value)} className="" placeholder="Code..." />
          <Button disabled={!code}>Enter</Button>
        </DialogContent>
      </Dialog>
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
        <img src={city.pictureUrl || '/images/default-city.png'} alt={city.name} className="rounded-[20px] mb-4" />
        <div className="rounded-[16px] bg-gray-blue p-4 flex gap-2 items-center flex-wrap mb-6">
          <div className="flex gap-1.5 items-center">
            <Calendar />
            {formatDate(new Date(city.eventStartsAt))}
          </div>
          <div className="flex gap-1.5 items-center">
            <Clock />
            {formatDate(new Date(city.eventStartsAt))}
          </div>
          {location && (
            <div className="flex gap-1.5 items-center">
              <Events className="[&_path]:fill-primary w-6 h-4 " />
              {location}
            </div>
          )}
          <div className="flex gap-1.5 items-center">
            <User />
            <p>
              {city.participants}/{city.maximumParticipants}
            </p>
          </div>
        </div>
        <p className="text-gray font-medium text-[14px] mb-6">{city.description}</p>
        <div className="flex justify-center mb-4">
          <Button
            onClick={() => setParticipateOpen(true)}
            disabled={city.participants === city.maximumParticipants}
            className="py-2"
          >
            {city.participants === city.maximumParticipants ? 'Full team' : 'Participate'}
          </Button>
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
