import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { Button } from '../components/ui/button';
import { useSendIntroSignature } from '../hooks/mutations/use-send-intro-signature';

export default function Home() {
  const { connected } = useWallet();
  const { mutateAsync: sendIntro } = useSendIntroSignature();

  const onSignMessage = async () => {
    try {
      await sendIntro();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <WalletMultiButton />
      {connected && <Button onClick={onSignMessage}>Sign message</Button>}
    </main>
  );
}
