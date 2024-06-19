import { useQuery } from '@tanstack/react-query';
import { getEventParticipants } from '@/api/get/events-participants';

export const useGetEventsParticipants = (eventId: string) => {
  return useQuery({
    queryKey: ['participants', eventId],
    queryFn: async () => {
      const events = await getEventParticipants({ eventId });
      return events.data?.participants;
    },
  });
};
