import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Loader2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { ArrowCircleLeft } from '@/components/icons/arrow-circle-left';
import { Calendar } from '@/components/icons/calendar';
import { Clock } from '@/components/icons/clock';
import { Events } from '@/components/icons/events';
import { User } from '@/components/icons/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAcceptParticipation } from '@/hooks/mutations/use-accept-participation';
import { useGeneratePassCode } from '@/hooks/mutations/use-generate-event-pass-code';
import { useParticipate } from '@/hooks/mutations/use-participate';
import { useGetCities } from '@/hooks/queries/use-get-cities';
import { useGetEventById } from '@/hooks/queries/use-get-event-by-id';
import { useGetParticipants } from '@/hooks/queries/use-get-participants';
import { generateBlockies } from '@/lib/blockies';
import { formatDate, formatTime, shortenAddress } from '@/lib/utils';
import { routes } from '@/router';
import { ParticipationStatus } from '@/api/get/participants.ts';

export default function Event() {
  const { id } = useParams() as { id: string | undefined };
  const { data: city, isLoading } = useGetEventById(id);
  const { data: cities } = useGetCities();
  const { publicKey } = useWallet();
  const [participateOpen, setParticipateOpen] = useState(false);
  const [participateSuccessOpen, setParticipateSuccessOpen] = useState(false);
  const [code, setCode] = useState('');

  const [adminCode, setAdminCode] = useState('123456');
  const { data: fetchedParticipants } = useGetParticipants(id);

  const participants = useMemo(() => {
    return fetchedParticipants?.participants ?? [];
  }, [fetchedParticipants]);

  const { mutateAsync: participate } = useParticipate();

  const { mutateAsync: generateCode } = useGeneratePassCode();
  const { mutateAsync: acceptParticipation } = useAcceptParticipation();
  const location = useMemo(() => {
    if (!city) return null;

    return cities?.find((c) => c.id === city.city)?.name ?? null;
  }, [cities, city]);

  const isAdmin = useMemo(() => {
    if (!publicKey || !city) return false;
    return city.admins.some((admin) => new PublicKey(admin).toString() === publicKey.toString());
  }, [city, publicKey]);

  const { toast } = useToast();

  const handleParticipate = useCallback(async () => {
    try {
      await participate({ entryCode: code, eventId: id! });
      setCode('');
      setParticipateOpen(false);
      setParticipateSuccessOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to participate',
        description: (error as Error).message,
      });
    }
  }, [code, id, participate, toast]);

  const handleAcceptParticipant = useCallback(
    async (participationId: string) => {
      try {
        await acceptParticipation({ eventId: id!, participationId });
        toast({
          variant: 'success',
          title: 'Successfully accepted user',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed accept participant',
          description: (error as Error).message,
        });
      }
    },
    [acceptParticipation, id, toast]
  );

  const handleGenerateCode = useCallback(async () => {
    try {
      const code = await generateCode({ eventId: id! });
      setAdminCode(code);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to participate',
        description: (error as Error).message,
      });
    }
  }, [generateCode, id, toast]);

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
          <Button onClick={handleParticipate} disabled={!code || !id}>
            Enter
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog onOpenChange={setParticipateSuccessOpen} open={participateSuccessOpen}>
        <DialogContent className="text-center gap-2">
          <h1 className="font-semibold text-[16px]">Application submitted</h1>
          <p className="text-[14px] font-medium text-gray">Thank you for registration 🥰</p>
          <p className="text-[14px] font-medium text-gray">
            The reward will be issued after the end of the event and the organizers mark the participants.
          </p>
          <p className="text-[14px] font-medium">Good luck! 🍀</p>
          <DialogClose asChild>
            <Button className="py-3">Ok</Button>
          </DialogClose>
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
        <img
          src={city.pictureUrl || '/images/default-city.png'}
          alt={city.name}
          className="rounded-[20px] object-cover max-h-[500px] mb-4"
        />
        <div className="rounded-[16px] bg-gray-blue p-4 flex gap-2 items-center flex-wrap mb-6">
          <div className="flex gap-1.5 items-center">
            <Calendar />
            {formatDate(new Date(city.eventStartsAt))}
          </div>
          <div className="flex gap-1.5 items-center">
            <Clock />
            {formatTime(city.eventStartsAt.toString())}
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
          <div className="flex gap-1.5 items-center">
            <img src="/images/star.png" alt="star" />
            {city.rewards}
          </div>
        </div>
        <div className="flex max-xl:w-full xl:justify-center mb-4">
          <Button
            onClick={() => setParticipateOpen(true)}
            disabled={city.participants === city.maximumParticipants || !publicKey || isAdmin}
            className="py-3  max-xl:w-full"
          >
            {city.participants === city.maximumParticipants ? 'Full team' : 'Participate'}
          </Button>
        </div>
        {isAdmin && (
          <div className="flex max-xl:w-full xl:justify-center mb-4">
            <Button
              onClick={handleGenerateCode}
              disabled={!id || city.participants === city.maximumParticipants}
              className="py-3  max-xl:w-full"
            >
              {city.participants === city.maximumParticipants ? 'Full team' : 'Generate code'}
            </Button>
          </div>
        )}
        {isAdmin && adminCode && (
          <div className="inline flex-col ">
            <Badge className="text-[14px] mb-2">{adminCode}</Badge>
            <p>Show this code to user that want participate in event</p>
          </div>
        )}
        <p className="text-gray font-medium text-[14px] mb-6">{city.description}</p>
        {participants && participants.length > 0 && (
          <div className="flex flex-col gap-4">
            <h6 className="text-[16px] font-semibold">Participants</h6>
            <div className="flex flex-col gap-4">
              {participants.map((participant) => {
                if (participant.status === ParticipationStatus.ACCEPTED) {
                  return (
                    <div key={participant.participant} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {generateBlockies(new PublicKey(participant.participant))}
                        <p className="xl:hidden">{shortenAddress(participant.participant)}</p>
                        <p className="max-xl:hidden">{participant.participant}</p>
                      </div>
                      {isAdmin && city.participants !== city.maximumParticipants && (
                        <Button onClick={() => handleAcceptParticipant(participant.participant)}>Accept</Button>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
