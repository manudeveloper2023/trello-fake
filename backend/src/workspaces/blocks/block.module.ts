import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockRepository } from './repositories/block.repository';
import { BlockTokens } from './block.tokens';
import { CreateBlockUseCase } from './use-cases/create-block.use-case';
import { MoveBlockUseCase } from './use-cases/move-block.use-case';
import { UpdateBlockUseCase } from './use-cases/update-block.use-case';
import { DeleteBlockUseCase } from './use-cases/delete-block.use-case';
import { AllBlocksForTaskUseCase } from './use-cases/all-blocks-for-task.use-case';
import { BlockPositionService } from './services/block-position.service';
import { AttachImageBlockUseCase } from './use-cases/attach-image-block.use-case';

@Module({
  providers: [
    {
      provide: BlockTokens.BlockRepository,
      useClass: BlockRepository,
    },
    {
      provide: BlockTokens.CreateBlockUseCase,
      useClass: CreateBlockUseCase,
    },
    {
      provide: BlockTokens.AllBlocksForTaskUseCase,
      useClass: AllBlocksForTaskUseCase,
    },
    {
      provide: BlockTokens.DeleteBlockUseCase,
      useClass: DeleteBlockUseCase,
    },
    {
      provide: BlockTokens.UpdateBlockUseCase,
      useClass: UpdateBlockUseCase,
    },
    {
      provide: BlockTokens.MoveBlockUseCase,
      useClass: MoveBlockUseCase,
    },
    {
      provide: BlockTokens.BlockPositionService,
      useClass: BlockPositionService,
    },
    {
      provide: BlockTokens.AttachImageBlockUseCase,
      useClass: AttachImageBlockUseCase,
    },
  ],
  controllers: [BlockController],
  exports: [
    BlockTokens.BlockRepository,
    BlockTokens.CreateBlockUseCase,
    BlockTokens.DeleteBlockUseCase,
    BlockTokens.UpdateBlockUseCase,
    BlockTokens.MoveBlockUseCase,
    BlockTokens.AllBlocksForTaskUseCase,
    BlockTokens.AttachImageBlockUseCase,
  ],
})
export class BlockModule {}
