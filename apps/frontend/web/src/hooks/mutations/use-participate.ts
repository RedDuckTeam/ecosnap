import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { postParticipate } from '@/api/post/participate-to-event';
import { useSignParticipate } from './signatures/use-sign-participate';

export const useParticipate = () => {
  const { publicKey } = useWallet();
  const { mutateAsync: auth } = useAuth();
  const { mutateAsync: signParticipate } = useSignParticipate();

  return useMutation({
    mutationFn: async ({eventId, entryCode}: {entryCode: string, eventId: string}) => {
      if(!publicKey) {
          throw new Error('No public key');
      }

      const accessToken = await auth();
      
      const {signature} = await signParticipate({eventId});

      const res = await postParticipate({
        signature,
        eventEntryCode: entryCode,
        jwt: accessToken
      })

      if(!res.data) throw new Error('Request failed')

      return res.data
    },
  });
};
