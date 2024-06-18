import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { encode } from 'bs58';

export const useSignAuth = () => {
  const { publicKey, signMessage } = useWallet();

  return useMutation({
    mutationFn: async () => {
      if (!signMessage || !publicKey) {
        throw new Error('No sign message found');
      }

      const nonce = crypto.randomUUID();
      const encodedMessage = new TextEncoder().encode(`Authorize in GarbageCollector: ${nonce}`);
      const signature = encode(await signMessage(encodedMessage));

      return { 
        signature,
        nonce
      }
    },
  });
};
