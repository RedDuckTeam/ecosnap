import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
/**
 *
 * @returns Amount of TOKENS in lamports
 */
export const useSolanaTokenBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const token = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // REPLACE WITH TOKEN
  return useQuery({
    queryKey: ['solana-token-balance', publicKey],
    queryFn: async () => {
      if (!publicKey) return null;
      const tokenAccountAddress = await getAssociatedTokenAddress(new PublicKey(token), publicKey);

      const tokenAccountInfo = await connection.getAccountInfo(tokenAccountAddress);
      if (!tokenAccountInfo) {
        throw new Error('Token account not found');
      }

      const tokenAccount = await getAccount(connection, tokenAccountAddress);

      return tokenAccount.amount;
    },
  });
};
