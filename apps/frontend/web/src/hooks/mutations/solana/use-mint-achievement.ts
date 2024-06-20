import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';

import { connection, gcGlobalState, gcProgramId, nftGlobalState, nftProgram } from '@/lib/sol-providers';
import { PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { GetUserAchievementsResponse } from '@/api/get/achievements';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

const toBinaryUUID = (uuid: string): Buffer => {
  const buf = Buffer.from(uuid.replace(/-/g, ''), 'hex');
  return Buffer.concat([buf.slice(6, 8), buf.slice(4, 6), buf.slice(0, 4), buf.slice(8, 16)]);
};

export const useMintAchievement = () => {
  const { publicKey, sendTransaction } = useWallet();

  return useMutation({
    mutationFn: async ({
      achievementId,
      merkleTreeId,
      proofs,
    }: {
      achievementId: string;
      merkleTreeId: string;
      proofs: GetUserAchievementsResponse['achievements'][number]['proofs'];
    }) => {
      if (!publicKey) {
        throw new Error('No public key');
      }

      const program = await nftProgram;

      const [mint] = PublicKey.findProgramAddressSync(
        [Buffer.from('mint-seed'), nftGlobalState.toBuffer()],
        program.programId
      );

      const [gcRootState] = PublicKey.findProgramAddressSync(
        [Buffer.from('root_state'), gcGlobalState.toBuffer(), toBinaryUUID(merkleTreeId)],
        gcProgramId
      );

      const mintTokenAccount = PublicKey.findProgramAddressSync(
        [publicKey.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )[0];

      const tx = await program.methods
        .create_mint_account(
          new PublicKey(proofs.leaf.user),
          new BN(proofs.leaf.amount),
          'name',
          'symb',
          'uri',
          Array.from(new Uint8Array(toBinaryUUID(achievementId))),
          Array.from(new Uint8Array(toBinaryUUID(merkleTreeId))),
          proofs.proof.map((v) => Array.from(v))
        )
        .accounts({
          payer: publicKey,
          global_state: gcGlobalState,
          nft_global_state: nftGlobalState,
          mint_token_account: mintTokenAccount,
          root_account: gcRootState,
        })
        .transaction();

      const txHash = await sendTransaction(tx, connection);

      const latestBlockHash = await connection.getLatestBlockhash({
        commitment: 'finalized',
      });
      await connection.confirmTransaction(
        {
          ...latestBlockHash,
          signature: txHash,
        },
        'finalized'
      );
    },
  });
};
