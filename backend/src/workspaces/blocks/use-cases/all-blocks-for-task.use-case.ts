import { Inject } from '@nestjs/common';
import { BlockTokens } from '../block.tokens';
import { ReadBlockDTO } from '../dtos/read-block.dto';
import type { BlockRepositoryInterface } from '../repositories/block.repository';

export interface AllBlocksForTaskUseCaseInterface {
  execute(taskId: number): Promise<ReadBlockDTO[]>;
}

export class AllBlocksForTaskUseCase implements AllBlocksForTaskUseCaseInterface {
  constructor(
    @Inject(BlockTokens.BlockRepository)
    private readonly blockRepository: BlockRepositoryInterface,
  ) {}
  async execute(taskId: number): Promise<ReadBlockDTO[]> {
    const blocks = await this.blockRepository.allBlocksForTask(taskId);

    const readBlockDTOs: ReadBlockDTO[] = blocks.map((block) => ({
      id: block.id,
      content: block.content,
      position: block.position,
      type: block.type,
    }));

    return readBlockDTOs;
  }
}
