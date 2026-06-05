import { Inject, Injectable } from '@nestjs/common';
import { BlockTokens } from '../block.tokens';
import { CreateBlockDTO } from '../dtos/create-block.dto';
import type { BlockRepositoryInterface } from '../repositories/block.repository';
import { ReadBlockDTO } from '../dtos/read-block.dto';
import { BlockPositionService } from '../services/block-position.service';
import { BlockMapper } from '../mappers/block.mapper';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';
export interface CreateBlockUseCaseInterface {
  execute(taskId: number, body: CreateBlockDTO): Promise<ReadBlockDTO>;
}

@Injectable()
export class CreateBlockUseCase implements CreateBlockUseCaseInterface {
  constructor(
    @Inject(BlockTokens.BlockPositionService)
    private readonly blockPositionService: BlockPositionService,
    @Inject(BlockTokens.BlockRepository)
    private readonly blockRepository: BlockRepositoryInterface,
  ) {}
  async execute(taskId: number, body: CreateBlockDTO): Promise<ReadBlockDTO> {
    const { beforeBlockId, afterBlockId } = body;

    const newPosition = await this.blockPositionService.calculateCreatePosition(
      taskId,
      {
        beforeBlockId,
        afterBlockId,
      },
    );

    const block = await this.blockRepository.createBlock(
      taskId,
      body,
      newPosition,
    );

    const readBlockDTO: ReadBlockDTO = BlockMapper.toDTO(block);

    return readBlockDTO;
  }
}
