import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Block } from 'src/generated/prisma/browser';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';

@Injectable()
export class BlockPositionValidator {
  static ensureSameTask(before: Block | null, after: Block | null) {
    if (before?.taskId !== after?.taskId && before !== null && after !== null) {
      throw new NotFoundException('Blocks must belong to same task');
    }
  }

  static ensureNotSelf(blockId: number, before: any, after: any) {
    if (before?.id === blockId || after?.id === blockId) {
      throw new NotFoundException('Cannot move relative to itself');
    }
  }

  static ensureNotNoOp(current: Decimal, next: Decimal) {
    if (current.equals(next)) {
      throw new NotFoundException('Already in position');
    }
  }

  static ensureOrderedPositions(before: Block, after: Block) {
    if (before.position.gte(after.position)) {
      throw new BadRequestException(
        'Before block position must be less than after block position',
      );
    }
  }
}
