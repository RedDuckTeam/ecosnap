import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { getUserAchievements } from '@/api/get/achievements';

export const useGetUserAchievements = () => {
  const { publicKey } = useWallet();
  return useQuery({
    queryKey: ['achievements', publicKey],
    enabled: !!publicKey,
    queryFn: async () => {
      if (!publicKey) return;

      const achievements = await getUserAchievements({ user: publicKey?.toBase58() ?? '' });

      console.log('achievements0');
      // const program = await Program.at<NFT_MINTER_IDL_TYPE>(nftProgramId, { connection });

      // console.log('achievements1', achievements);
      // if (!achievements?.achievements) return [];
      // const [mint] = PublicKey.findProgramAddressSync(
      //   [Buffer.from('mint-seed'), nftGlobalState.toBuffer()],

      //   program.programId
      // );

      // for (let ach of achievements.achievements) {
      //   const tokenAccount = await getAccount(
      //     connection,
      //     PublicKey.findProgramAddressSync(
      //       [publicKey.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      //       ASSOCIATED_TOKEN_PROGRAM_ID
      //     )[0],
      //     undefined,
      //     TOKEN_2022_PROGRAM_ID
      //   ).catch((err) => ({ amount: 0 }));

      //   ach.isMinted = tokenAccount.amount > 0;
      // }

      return achievements.achievements;
    },
  });
};
