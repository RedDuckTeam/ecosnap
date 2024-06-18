import { Inject, Injectable } from '@nestjs/common';
import { ProvidersModuleConfig } from './provider.module-definition';
import { Connection, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { MERKLE_SUBMITTER_IDL, MERKLE_SUBMITTER_IDL_TYPE } from './idls/merkle-submitter.idl';

@Injectable()
export class ProvidersService {
  constructor(
    @Inject('PROVIDERS_CONFIG')
    public readonly config: ProvidersModuleConfig
  ) {}

  async getPriorityRate() {
    return 600_000n;
  }

  getPrograms() {
    const { keypair, provider } = this.getSolSigner();

    return {
      merkleSubmitter: {
        globalState: this.config.sol.programs.merkleSubmitter.globalState,
        program: new Program<MERKLE_SUBMITTER_IDL_TYPE>(
          MERKLE_SUBMITTER_IDL as any,
          this.config.sol.programs.merkleSubmitter.programId,
          new AnchorProvider(provider, new Wallet(keypair), {
            commitment: 'confirmed',
          })
        ),
      },
    };
  }

  getSolProvider() {
    if (!this.config.sol.rpc) throw new Error('Provider for SOL is not configured');
    const provider = new Connection(this.config.sol.rpc, 'finalized');
    return provider;
  }

  getSolSigner() {
    if (!this.config.sol.pk) throw new Error('PK for SOL is not configured');
    const provider = this.getSolProvider();
    const keypair = Keypair.fromSecretKey(Buffer.from(this.config.sol.pk, 'hex'));

    return { provider, keypair };
  }
}
