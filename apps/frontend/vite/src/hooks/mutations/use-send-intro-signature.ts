import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { encode } from 'bs58';
import { useGetIntroMessage } from '../queries/use-get-intro-message';


export const useSendIntroSignature = () => {
  const { publicKey, signMessage } = useWallet();
  const { data: introMessage } = useGetIntroMessage(
    publicKey?.toBase58() ?? '',
  );

  return useMutation({
    mutationFn: async () => {
      if (!introMessage || !signMessage) {
        throw new Error('No intro message found');
      }

      const encodedMessage = new TextEncoder().encode(introMessage);
      const signature = encode(await signMessage(encodedMessage));

      alert(`Signature: ${signature}`);
    },
  });
};
