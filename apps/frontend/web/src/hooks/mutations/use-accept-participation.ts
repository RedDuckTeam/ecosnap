import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSignEventParticipateAccept } from './signatures/use-sign-event-participate-accept';
import { useAuth } from './use-auth';

import { postParticipationAccept } from '@/api/post/event-participation-accept';

export const useAcceptParticipation = () => {
  const { publicKey } = useWallet();
  const { mutateAsync: auth } = useAuth();
  const { mutateAsync: signAccept } = useSignEventParticipateAccept();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, participationId }: { participationId: string; eventId: string }) => {
      if (!publicKey) {
        throw new Error('No public key');
      }

      const accessToken = await auth();

      const { signature } = await signAccept({ participationId });

      await postParticipationAccept({
        signature,
        eventId,
        participationId,
        jwt: accessToken,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['event'] });
      await queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  });
};
