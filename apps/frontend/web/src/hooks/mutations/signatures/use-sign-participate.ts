import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { encode } from 'bs58';

export const useSignParticipate = () => {
  const { publicKey, signMessage } = useWallet();

  return useMutation({
    mutationFn: async ({eventId}:{eventId: string}) => {
      if (!signMessage || !publicKey) {
        throw new Error('No sign message found');
      }

      const encodedMessage = new TextEncoder().encode(`Confirming participation for: ${eventId}`);
      const signature = encode(await signMessage(encodedMessage));

      return { 
        signature,
      }
    },
  });
};
