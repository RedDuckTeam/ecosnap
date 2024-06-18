import { CastVoteDirection } from '@/api/post/vote';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { encode } from 'bs58';

export const useSignDaoVote = () => {
  const { publicKey, signMessage } = useWallet();

  return useMutation({
    mutationFn: async ({gcId,voteDirection}:{gcId: string, voteDirection: CastVoteDirection}) => {
      if (!signMessage || !publicKey) {
        throw new Error('No sign message found');
      }

      const encodedMessage = new TextEncoder().encode(`Confirming vote cast for: ${gcId}, cast direction: ${voteDirection}`);
      const signature = encode(await signMessage(encodedMessage));

      return { 
        signature,
      }
    },
  });
};
