import { Inject, Injectable } from '@nestjs/common';
import { BlockTokens } from '../block.tokens';
import { CreateBlockDTO } from '../dtos/create-block.dto';
import type { BlockRepositoryInterface } from '../repositories/block.repository';
import { ReadBlockDTO } from '../dtos/read-block.dto';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespaceBrowser';

export interface CreateBlockUseCaseInterface {
  execute(taskId: number, body: CreateBlockDTO): Promise<ReadBlockDTO>;
}

@Injectable()
export class CreateBlockUseCase implements CreateBlockUseCaseInterface {
  constructor(
    @Inject(BlockTokens.BlockRepository)
    private readonly blockRepository: BlockRepositoryInterface,
  ) {}
  async execute(taskId: number, body: CreateBlockDTO): Promise<ReadBlockDTO> {
    const lastBlock = await this.blockRepository.getLastBlockForTask(taskId);
    const newPosition = lastBlock
      ? lastBlock.position.add(1000)
      : new Decimal(1000);

    const block = await this.blockRepository.createBlock(
      taskId,
      body,
      newPosition,
    );

    const readBlockDTO: ReadBlockDTO = {
      id: block.id,
      content: block.content,
      position: block.position,
      type: block.type,
    };

    return readBlockDTO;
  }
}
