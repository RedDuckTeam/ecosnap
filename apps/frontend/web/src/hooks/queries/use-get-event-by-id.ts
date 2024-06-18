import { useQuery } from '@tanstack/react-query';

import { useGetEvents } from '@/hooks/queries/use-get-events';
import { timeout } from '@/lib/timeout';

export const useGetEventById = (id: string | undefined) => {
  const { data: events } = useGetEvents('', '');

  return useQuery({
    queryKey: ['event', events, id],
    queryFn: async () => {
      await timeout(1000);
      return events?.find((e) => e.id === id) ?? null;
    },
    enabled: !!events && !!id,
  });
};
