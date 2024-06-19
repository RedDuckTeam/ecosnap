import { useQuery } from '@tanstack/react-query';
import { getParticipants } from '@/api/get/participants.ts';

export const useGetParticipants = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ['participants', eventId],
    enabled: !!eventId,
    queryFn: async () => {
      if (!eventId) return;

      const participants = await getParticipants(eventId);
      return participants.data;
    },
  });
};
