import { useQuery } from '@tanstack/react-query';

import { timeout } from '@/lib/timeout';

export type Event = {
  id: string;
  name: string;
  cityId: string;
  date: string;
  shortDescription: string;
  description: string;
};

const events: Event[] = [
  {
    id: '1',
    name: 'Event 1',
    cityId: '1',
    date: '2022-01-01',
    shortDescription: 'Description 1',
    description: 'Description 1 long description...',
  },
  {
    id: '2',
    name: 'Event 2',
    cityId: '2',
    date: '2022-01-02',
    shortDescription: 'Description 2',
    description: 'Description 2 long description...',
  },
  {
    id: '3',
    name: 'Event 3',
    cityId: '3',
    date: '2022-01-03',
    shortDescription: 'Description 3',
    description: 'Description 3 long description...',
  },
  {
    id: '4',
    name: 'Event 4',
    cityId: '4',
    date: '2022-01-04',
    shortDescription: 'Description 4',
    description: 'Description 4 long description...',
  },
  {
    id: '5',
    name: 'Event 5',
    cityId: '1',
    date: '2022-01-05',
    shortDescription: 'Description 5',
    description: 'Description 5 long description...',
  },
];

export const useGetEvents = (cityId: string, search: string) => {
  return useQuery({
    queryKey: ['events', cityId, search],
    queryFn: async () => {
      await timeout(1000);
      const filteredEvents = events.filter((e) => {
        if (cityId && e.cityId !== cityId) {
          return false;
        }

        if (search && !e.name.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }

        return true;
      });
      return filteredEvents;
    },
  });
};
