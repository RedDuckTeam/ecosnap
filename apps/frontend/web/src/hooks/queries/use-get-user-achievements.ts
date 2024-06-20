import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { getUserAchievements } from '@/api/get/achievements';
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAccount, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { connection, nftGlobalState, nftProgram } from '@/lib/sol-providers';
import { PublicKey } from '@solana/web3.js';

export const useGetUserAchievements = () => {
  const { publicKey } = useWallet();
  return useQuery({
    queryKey: ['achievements', publicKey],
    queryFn: async () => {
      if (!publicKey) return;

      const achievements = await getUserAchievements({ user: publicKey?.toBase58() });

      const program = await nftProgram;

      if (!achievements.data?.achievements) return [];
      const [mint] = PublicKey.findProgramAddressSync(
        [Buffer.from('mint-seed'), nftGlobalState.toBuffer()],

        program.programId
      );
      for (let ach of achievements.data.achievements) {
        const tokenAccount = await getAccount(
          connection,
          PublicKey.findProgramAddressSync(
            [publicKey.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            ASSOCIATED_TOKEN_PROGRAM_ID
          )[0],
          undefined,
          TOKEN_2022_PROGRAM_ID
        ).catch((err) => ({ amount: 0 }));

        ach.isMinted = tokenAccount.amount > 0;
      }

      return achievements.data.achievements;
    },
  });
};
