import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { CastVoteDirection, postVote } from '@/api/post/vote';
import { useSignDaoVote } from './signatures/use-sign-dao-vote';

export const useDaoVote = () => {
  const { publicKey } = useWallet();
  const { mutateAsync: auth } = useAuth();
  const { mutateAsync: signDaoVote } = useSignDaoVote();

  return useMutation({
    mutationFn: async ({gcId, voteDirection}: {gcId: string, voteDirection: CastVoteDirection}) => {
      if(!publicKey) {
          throw new Error('No public key');
      }

      const accessToken = await auth();

      const {signature} = await signDaoVote({gcId, voteDirection });
      
      await postVote({
        garbageCollectId: gcId,
        signature,
        voteDirection,
        jwt: accessToken
      })
    },
  });
};
