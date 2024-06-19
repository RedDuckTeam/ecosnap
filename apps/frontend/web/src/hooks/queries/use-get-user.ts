import { useQuery } from '@tanstack/react-query';

import { useAuth } from '../mutations/use-auth';

import { getUser } from '@/api/get/user';

export const useGetUser = () => {
  const { mutateAsync: auth } = useAuth();

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const jwt = await auth();
      const user = await getUser({ jwt });
      return user.data?.user;
    },
  });
};
