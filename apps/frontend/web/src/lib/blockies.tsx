import type { PublicKey } from '@solana/web3.js';
// @ts-expect-error TYPES
import Blockies from 'react-blockies';

export const generateBlockies = (address: PublicKey | null) => (
  <Blockies seed={address?.toString() || ''} size={10} scale={3} className="rounded-full" />
);
