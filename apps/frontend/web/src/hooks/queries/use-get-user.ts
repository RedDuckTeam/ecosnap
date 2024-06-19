import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/get/user';
import { useAuth } from '../mutations/use-auth';

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
