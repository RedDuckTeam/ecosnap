import type { PublicKey } from '@solana/web3.js';
// @ts-expect-error TYPES
import Blockies from 'react-blockies';

export const generateBlockies = (address: PublicKey | null, size: number = 10) => (
  <Blockies seed={address?.toString() || ''} size={size} scale={3} className="rounded-full " />
);
