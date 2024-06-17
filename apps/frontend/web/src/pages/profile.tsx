import { useSolanaTokenBalance } from '@/hooks/queries/use-solana-token-balance';

export default function Profile() {
  const { data: res } = useSolanaTokenBalance();
  console.log(res);

  return <main className={`flex flex-1 flex-col items-center justify-between p-24`}></main>;
}
