import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { encode } from 'bs58';

export const useSignEventParticipateAccept = () => {
  const { publicKey, signMessage } = useWallet();

  return useMutation({
    mutationFn: async ({ participationId }: { participationId: string }) => {
      if (!signMessage || !publicKey) {
        throw new Error('No sign message found');
      }

      const encodedMessage = new TextEncoder().encode(`Accepting participation for: ${participationId}`);
      const signature = encode(await signMessage(encodedMessage));

      return {
        signature,
      };
    },
  });
};
