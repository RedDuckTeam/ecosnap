import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

/**
 *
 * @returns Amount of SOL in lamports
 */
export const useSolanaBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  return useQuery({
    queryKey: ['solana-balance', publicKey],
    queryFn: async () => {
      if (!publicKey) return null;
      return await connection.getBalance(publicKey);
    },
  });
};
