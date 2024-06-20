import { Connection, PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { NFT_MINTER_IDL_TYPE } from './idl/NftMinter.idl';

const endpoint = process.env.VITE_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';

export const connection = new Connection(endpoint, 'confirmed');

export const nftProgramId = new PublicKey('7PkvYFurAyci1hZFhkvfwHvMFZt9ctdpK8pogGNVizjm');

export const gcGlobalState = new PublicKey('9b6WPU1sD4XwiYFx3rHUf6WGRVTVEE9kF4Gfs9FmZDQL');
export const nftGlobalState = new PublicKey('31JfzFiKXZigygAed4PoPp73L6GDHizJdPVf2rrVacgx');
export const nftProgram = Program.at<NFT_MINTER_IDL_TYPE>(nftProgramId, { connection });
export const gcProgramId = new PublicKey('5Mew5NxqLr5NGG6VbHtkNNK6LNGa5ucKyuV6stWmfy16');
