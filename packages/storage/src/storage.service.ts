import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { StorageModuleConfig } from './storage.module-definition';
@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_CONFIG')
    public readonly config: StorageModuleConfig
  ) {}

  async writeFile({ id, content, extension }: { id: string; content: Buffer; extension: string }) {
    throw new NotImplementedException();
  }

  async readFile({}: { id: string }): Promise<Buffer> {
    throw new NotImplementedException();
  }
}
