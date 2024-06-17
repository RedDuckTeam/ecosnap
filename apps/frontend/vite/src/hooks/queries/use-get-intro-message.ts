import { useQuery } from '@tanstack/react-query';
import { getIntroMessage } from '../../api/get/intro-message';


export const useGetIntroMessage = (publicKey: string) => {
  return useQuery({
    queryKey: ['messages', 'intro', publicKey],
    queryFn: () => getIntroMessage(publicKey),
  });
};
