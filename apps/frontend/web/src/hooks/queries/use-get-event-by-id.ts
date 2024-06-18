import { useQuery } from '@tanstack/react-query';

import { useGetEvents } from '@/hooks/queries/use-get-events';

export const useGetEventById = (id: string | undefined) => {
  const { data: events } = useGetEvents('', '');

  return useQuery({
    queryKey: ['event', events, id],
    queryFn: async () => {
      return events?.find((e) => e.id === id) ?? null;
    },
    enabled: !!events && !!id,
  });
};
