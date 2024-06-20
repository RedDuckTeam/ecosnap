import { User } from '../icons/user';
import { Button } from '../ui/button';

import type { Events } from '@/api/get/events';
import { useGetCities } from '@/hooks/queries/use-get-cities';
import { formatDate, formatTime } from '@/lib/utils';

type Props = {
  isMy: boolean;
  event: Events['events'][number];
  onClick: (event: Events['events'][number]) => void;
};

export const EventCard = ({ event, onClick, isMy }: Props) => {
  const { data: cities } = useGetCities();

  return (
    <div
      key={event.id}
      className="flex gap-4 p-4  rounded-[16px] bg-gray-blue shadow-md transition-all cursor-pointer"
      onClick={() => onClick(event)}
    >
      <img
        src={event.pictureUrl || '/images/default-city.png'}
        alt={event.name}
        className="rounded-[20px] object-cover overflow-hidden xl:h-[180px] xl:w-[250px] w-[120px] h-[170px]"
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{event.name}</h2>
        <div className="text-[14px] font-semibold">
          {formatDate(new Date(event.eventStartsAt))} {formatTime(event.eventStartsAt.toString())}
        </div>
        <p className="text-sm text-gray">{cities?.find((c) => c === event.city)}</p>
        {/* <p className="text-sm">{event.description}</p> */}
        <div className="flex items-center gap-2">
          <User className="[&_path]:fill-gray" />
          <p className="text-gray font-medium">
            {event.participants}/{event.maximumParticipants} person
          </p>
        </div>
        <div className="flex-1 flex items-end">
          <Button disabled={event.participants === event.maximumParticipants || isMy}>
            {isMy ? "You're in" : event.participants === event.maximumParticipants ? 'Full team' : 'Participate'}
          </Button>
        </div>
      </div>
    </div>
  );
};
