import { useQuery } from '@tanstack/react-query';

import { getEvents } from '@/api/get/events';

export const useGetEvents = (cityId: string, search: string) => {
  return useQuery({
    queryKey: ['events', cityId, search],
    queryFn: async () => {
      const events = await getEvents();
      const filteredEvents = events.data?.events?.filter?.((e) => {
        if (cityId && e.city !== cityId) {
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
