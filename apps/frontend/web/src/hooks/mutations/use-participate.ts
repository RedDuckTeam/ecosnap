import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSignParticipate } from './signatures/use-sign-participate';
import { useAuth } from './use-auth';

import { postParticipate } from '@/api/post/participate-to-event';

export const useParticipate = () => {
  const { publicKey } = useWallet();
  const { mutateAsync: auth } = useAuth();
  const { mutateAsync: signParticipate } = useSignParticipate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, entryCode }: { entryCode: string; eventId: string }) => {
      if (!publicKey) {
        throw new Error('No public key');
      }

      const accessToken = await auth();

      const { signature } = await signParticipate({ eventId });

      const res = await postParticipate({
        signature,
        eventEntryCode: entryCode,
        jwt: accessToken,
      });

      if (!res.data) throw new Error('Request failed');

      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['event'] });
      await queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  });
};
