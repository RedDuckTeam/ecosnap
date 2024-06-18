import { Button } from '../ui/button';

import { useGetCities } from '@/hooks/queries/use-get-cities';
import type { Event } from '@/hooks/queries/use-get-events';
import { formatDate } from '@/lib/utils';

type Props = {
  event: Event;
  onClick: (event: Event) => void;
};

export const EventCard = ({ event, onClick }: Props) => {
  const { data: cities } = useGetCities();

  return (
    <div
      key={event.id}
      className="flex gap-4 p-4  rounded-[16px] bg-gray-blue shadow-md transition-all cursor-pointer"
      onClick={() => onClick(event)}
    >
      <img
        src="https://media.istockphoto.com/id/585779866/photo/blue-pearl-capital-city-austin-texas.jpg?s=612x612&w=0&k=20&c=rwtyB3br8j659kTbQyHdCJUO2O1UnzwMyXaZ-HcNV4c="
        alt={event.name}
        className="rounded-[20px] object-cover overflow-hidden xl:h-[180px] xl:w-[250px] w-[120px] h-[170px]"
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{event.name}</h2>
        <div className="text-[14px] font-semibold">{formatDate(event.date)}</div>
        <p className="text-sm text-gray">{cities?.find((c) => c.id === event.cityId)?.name}</p>
        <p className="text-sm">{event.shortDescription}</p>
        <div className="flex-1 flex items-end">
          <Button>Participate</Button>
        </div>
      </div>
    </div>
  );
};
