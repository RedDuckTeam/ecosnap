import { getIntroMessage } from '@/api/get/intro-message';
import { useQuery } from '@tanstack/react-query';

export const useGetIntroMessage = (publicKey: string) => {
  return useQuery({
    queryKey: ['messages', 'intro', publicKey],
    queryFn: () => getIntroMessage(publicKey),
  });
};
