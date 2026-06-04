import { Inject } from '@nestjs/common';
import { BlockTokens } from '../block.tokens';
import { ReadBlockDTO } from '../dtos/read-block.dto';
import { UpdateBlockDTO } from '../dtos/update-block.dto';
import type { BlockRepositoryInterface } from '../repositories/block.repository';

export interface UpdateBlockUseCaseInterface {
  execute(blockId: number, body: UpdateBlockDTO): Promise<ReadBlockDTO>;
}

export class UpdateBlockUseCase implements UpdateBlockUseCaseInterface {
  constructor(
    @Inject(BlockTokens.BlockRepository)
    private readonly blockRepository: BlockRepositoryInterface,
  ) {}
  async execute(blockId: number, body: UpdateBlockDTO): Promise<ReadBlockDTO> {
    const block = await this.blockRepository.updateBlock(blockId, body);

    const readBlockDTO: ReadBlockDTO = {
      id: block.id,
      content: block.content,
      position: block.position,
      type: block.type,
    };

    return readBlockDTO;
  }
}
