import { Connection, PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { NFT_MINTER_IDL_TYPE } from './idl/NftMinter.idl';

const endpoint = process.env.VITE_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://solana-rpc.publicnode.com';

export const connection = new Connection(endpoint, 'confirmed');

const nftProgramId = new PublicKey('7PkvYFurAyci1hZFhkvfwHvMFZt9ctdpK8pogGNVizjm');

export const nftProgram = Program.at<NFT_MINTER_IDL_TYPE>(nftProgramId, { connection });
