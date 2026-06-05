import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';
import type { BlockRepositoryInterface } from '../repositories/block.repository';
import { BlockTokens } from '../block.tokens';
import { MoveBlockDTO } from '../dtos/move-block.dto';
import { AttachBlockDTO } from '../dtos/attach-block.dto';
import { BlockPositionValidator } from '../validators/block-position.validator';
import { BlockPositionEngine } from './block-position-engine.service';
import { Block } from 'src/generated/prisma/browser';

@Injectable()
export class BlockPositionService {
  constructor(
    @Inject(BlockTokens.BlockRepository)
    private readonly blockRepository: BlockRepositoryInterface,
  ) {}

  async calculateMovePosition(
    body: MoveBlockDTO,
    blockId: number,
  ): Promise<Decimal> {
    const block = await this.blockRepository.getBlockById(blockId);
    if (!block) throw new NotFoundException('Block not found');

    const { beforeBlock, afterBlock } = await this.resolveBlocks(
      body.beforeBlockId,
      body.afterBlockId,
    );

    BlockPositionValidator.ensureNotSelf(blockId, beforeBlock, afterBlock);

    const newPosition = this.resolvePosition({
      beforeBlock,
      afterBlock,
    });

    if (block.taskId !== beforeBlock?.taskId && beforeBlock) {
      throw new NotFoundException(
        'Before block does not belong to the same task as the block being moved',
      );
    }

    if (block.taskId !== afterBlock?.taskId && afterBlock) {
      throw new NotFoundException(
        'After block does not belong to the same task as the block being moved',
      );
    }

    BlockPositionValidator.ensureNotNoOp(block.position, newPosition);

    return newPosition;
  }

  async calculateCreatePosition(
    taskId: number,
    body?: AttachBlockDTO,
  ): Promise<Decimal> {
    const { beforeBlock, afterBlock } = await this.resolveBlocks(
      body?.beforeBlockId,
      body?.afterBlockId,
    );

    if (beforeBlock && beforeBlock.taskId !== taskId) {
      throw new NotFoundException('Before block does not belong to task');
    }

    if (afterBlock && afterBlock.taskId !== taskId) {
      throw new NotFoundException('After block does not belong to task');
    }

    // If no position specified, place at end of list because this means there's no other blocks to position relative to

    if (!beforeBlock && !afterBlock) {
      const lastBlock = await this.blockRepository.getLastBlockForTask(taskId);

      if (!lastBlock) {
        return new Decimal(1000);
      }

      return BlockPositionEngine.after(lastBlock.position);
    }

    BlockPositionValidator.ensureSameTask(beforeBlock, afterBlock);

    return this.resolvePosition({
      beforeBlock,
      afterBlock,
    });
  }

  private resolvePosition(params: {
    beforeBlock: Block | null;
    afterBlock: Block | null;
  }): Decimal {
    const { beforeBlock, afterBlock } = params;

    if (beforeBlock && afterBlock) {
      BlockPositionValidator.ensureSameTask(beforeBlock, afterBlock);
      return BlockPositionEngine.between(
        beforeBlock.position,
        afterBlock.position,
      );
    }

    if (beforeBlock) {
      return BlockPositionEngine.after(beforeBlock.position);
    }

    if (afterBlock) {
      return BlockPositionEngine.before(afterBlock.position);
    }

    throw new NotFoundException('Unable to determine position');
  }

  private async resolveBlocks(beforeId?: number, afterId?: number) {
    const [beforeBlock, afterBlock] = await Promise.all([
      beforeId ? this.blockRepository.getBlockById(beforeId) : null,
      afterId ? this.blockRepository.getBlockById(afterId) : null,
    ]);

    if (beforeId && !beforeBlock) {
      throw new NotFoundException('Before block not found');
    }

    if (afterId && !afterBlock) {
      throw new NotFoundException('After block not found');
    }

    return { beforeBlock, afterBlock };
  }
}
