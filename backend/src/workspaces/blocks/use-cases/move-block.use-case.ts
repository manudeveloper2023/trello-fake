import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MoveBlockDTO } from '../dtos/move-block.dto';
import { BlockTokens } from '../block.tokens';
import type { BlockRepositoryInterface } from '../repositories/block.repository';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';

export interface MoveBlockUseCaseInterface {
  execute(blockId: number, body: MoveBlockDTO): Promise<void>;
}

@Injectable()
export class MoveBlockUseCase implements MoveBlockUseCaseInterface {
  constructor(
    @Inject(BlockTokens.BlockRepository)
    private readonly blockRepository: BlockRepositoryInterface,
  ) {}
  async execute(blockId: number, body: MoveBlockDTO): Promise<void> {
    let newPosition: Decimal = new Decimal(0);

    const block = await this.blockRepository.getBlockById(blockId);

    if (!block) {
      throw new NotFoundException('The specified block does not exist');
    }

    if (body.beforeBlockId === blockId || body.afterBlockId === blockId) {
      throw new NotFoundException(
        'A block cannot be moved before or after itself',
      );
    }

    if (body.beforeBlockId && body.afterBlockId) {
      const beforeBlock = await this.blockRepository.getBlockById(
        body.beforeBlockId,
      );
      const afterBlock = await this.blockRepository.getBlockById(
        body.afterBlockId,
      );

      if (!beforeBlock || !afterBlock) {
        throw new NotFoundException(
          'One or both of the specified blocks do not exist',
        );
      }

      if (beforeBlock.taskId !== afterBlock.taskId) {
        throw new NotFoundException(
          'Blocks must belong to the same task to be moved',
        );
      }

      newPosition = beforeBlock.position.add(afterBlock.position).div(2);
    }

    if (body.beforeBlockId && !body.afterBlockId) {
      const beforeBlock = await this.blockRepository.getBlockById(
        body.beforeBlockId,
      );

      if (!beforeBlock) {
        throw new NotFoundException('The specified block does not exist');
      }

      newPosition = beforeBlock.position.add(1000);
    }

    if (!body.beforeBlockId && body.afterBlockId) {
      const afterBlock = await this.blockRepository.getBlockById(
        body.afterBlockId,
      );

      if (!afterBlock) {
        throw new NotFoundException('The specified block does not exist');
      }

      newPosition = afterBlock.position.sub(1000);
    }

    if (!body.beforeBlockId && !body.afterBlockId) {
      throw new NotFoundException(
        'At least one of beforeBlockId or afterBlockId must be provided',
      );
    }

    await this.blockRepository.moveBlock(blockId, newPosition);
  }
}
