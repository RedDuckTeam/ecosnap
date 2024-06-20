import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSignEventResultAccept } from './signatures/use-sign-event-result-accept';
import { useAuth } from './use-auth';

import { postParticipationResultAccept } from '@/api/post/event-participation-results.accept';

export const useAcceptResult = () => {
  const { publicKey } = useWallet();
  const { mutateAsync: auth } = useAuth();
  const { mutateAsync: signAccept } = useSignEventResultAccept();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, participationId }: { participationId: string; eventId: string }) => {
      if (!publicKey) {
        throw new Error('No public key');
      }

      const accessToken = await auth();

      const { signature } = await signAccept({ participationId });

      await postParticipationResultAccept({
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
