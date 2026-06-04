import { Inject, Injectable } from '@nestjs/common';
import { BlockTokens } from '../block.tokens';
import type { BlockRepositoryInterface } from '../repositories/block.repository';

export interface DeleteBlockUseCaseInterface {
  execute(blockId: number): Promise<void>;
}

@Injectable()
export class DeleteBlockUseCase implements DeleteBlockUseCaseInterface {
  constructor(
    @Inject(BlockTokens.BlockRepository)
    private readonly blockRepository: BlockRepositoryInterface,
  ) {}
  async execute(blockId: number): Promise<void> {
    await this.blockRepository.deleteBlock(blockId);
  }
}
