import { useQuery } from '@tanstack/react-query';

import { useGetUser } from './use-get-user';

export const useGetMyPoints = () => {
  const { data: user } = useGetUser();

  return useQuery({
    queryKey: ['my-points', user],
    queryFn: () => {
      return user?.points ?? 0;
    },
  });
};
