import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MoveBlockDTO } from '../dtos/move-block.dto';
import { BlockTokens } from '../block.tokens';
import type { BlockRepositoryInterface } from '../repositories/block.repository';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';
import { BlockPositionService } from '../services/block-position.service';

export interface MoveBlockUseCaseInterface {
  execute(blockId: number, body: MoveBlockDTO): Promise<void>;
}

@Injectable()
export class MoveBlockUseCase implements MoveBlockUseCaseInterface {
  constructor(
    @Inject(BlockTokens.BlockRepository)
    private readonly blockRepository: BlockRepositoryInterface,
    @Inject(BlockTokens.BlockPositionService)
    private readonly blockPositionService: BlockPositionService,
  ) {}
  async execute(blockId: number, body: MoveBlockDTO): Promise<void> {
    const block = await this.blockRepository.getBlockById(blockId);

    if (!block) {
      throw new NotFoundException('The specified block does not exist');
    }

    const newPosition = await this.blockPositionService.calculateMovePosition(
      body,
      blockId,
    );

    await this.blockRepository.moveBlock(blockId, newPosition);
  }
}
