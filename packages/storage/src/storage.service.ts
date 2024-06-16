import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { StorageModuleConfig } from './storage.module-definition';
import { Akord, Auth } from '@akord/akord-js';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_CONFIG')
    public readonly config: StorageModuleConfig
  ) {}

  async getClient(): Promise<Akord> {
    const { wallet } = await Auth.signIn(this.config.email, this.config.password);
    return new Akord(wallet);
  }

  async writeFile({ content, id, extension }: { content: Buffer; id: string; extension: string }): Promise<string> {
    const akord = await this.getClient();

    const vaults = await akord.vault.listAll();

    let vaultId: string;

    if (vaults.length === 0) {
      vaultId = (await akord.vault.create('GC Service Vault', { public: true })).vaultId;
    } else {
      vaultId = vaults[0].id;
    }

    const { stackId } = await akord.stack.create(vaultId, content, { public: true, name: `${id}'.${extension}` });

    return stackId;
  }

  async readFile(stackId: string): Promise<ArrayBuffer | ReadableStream<Uint8Array>> {
    const akord = await this.getClient();
    const stack = await akord.stack.get(stackId);
    const file = await akord.stack.getVersion(stackId, stack.versions.length - 1);

    return file.data;
  }
}
