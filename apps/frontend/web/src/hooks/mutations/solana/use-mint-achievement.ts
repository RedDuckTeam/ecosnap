import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';

import { useSignEventParticipateAccept } from './signatures/use-sign-event-participate-accept';
import { useAuth } from './use-auth';

import { postParticipationAccept } from '@/api/post/event-participation-accept';
import { connection, nftProgram } from '@/lib/sol-providers';
import { sendAndConfirmTransaction } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export const useMintAchievement = ({
  achievementId,
  merkleTreeId,
}: {
  achievementId: string;
  merkleTreeId: string;
}) => {
  const { publicKey } = useWallet();
  const { mutateAsync: auth } = useAuth();
  const { mutateAsync: signAccept } = useSignEventParticipateAccept();

  return useMutation({
    mutationFn: async ({ eventId, participationId }: { participationId: string; eventId: string }) => {
      if (!publicKey) {
        throw new Error('No public key');
      }

      const program = await nftProgram;
      const tx = program.methods
        .create_mint_account(
          publicKey,
          new BN(1),
          'name',
          'symb',
          'uri',
          Array.from(new Uint8Array(achievementId)),
          Array.from(new Uint8Array(merkleTreeId)),
          proofs.map((v) => Array.from(v))
        )
        .transaction();

      await sendAndConfirmTransaction(connection, tx, []);

      const accessToken = await auth();

      const { signature } = await signAccept({ participationId });

      await postParticipationAccept({
        signature,
        eventId,
        participationId,
        jwt: accessToken,
      });
    },
  });
};
