import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import type { AllBlocksForTaskUseCaseInterface } from './use-cases/all-blocks-for-task.use-case';
import { BlockTokens } from './block.tokens';
import type { MoveBlockUseCaseInterface } from './use-cases/move-block.use-case';
import type { DeleteBlockUseCaseInterface } from './use-cases/delete-block.use-case';
import type { UpdateBlockUseCaseInterface } from './use-cases/update-block.use-case';
import type { CreateBlockUseCaseInterface } from './use-cases/create-block.use-case';
import { CreateBlockDTO } from './dtos/create-block.dto';
import { UpdateBlockDTO } from './dtos/update-block.dto';
import { MoveBlockDTO } from './dtos/move-block.dto';

@Controller('/tasks/:taskId/blocks')
export class BlockController {
  constructor(
    @Inject(BlockTokens.AllBlocksForTaskUseCase)
    private readonly allBlocksForTaskUseCase: AllBlocksForTaskUseCaseInterface,
    @Inject(BlockTokens.CreateBlockUseCase)
    private readonly createBlockUseCase: CreateBlockUseCaseInterface,
    @Inject(BlockTokens.UpdateBlockUseCase)
    private readonly updateBlockUseCase: UpdateBlockUseCaseInterface,
    @Inject(BlockTokens.DeleteBlockUseCase)
    private readonly deleteBlockUseCase: DeleteBlockUseCaseInterface,
    @Inject(BlockTokens.MoveBlockUseCase)
    private readonly moveBlockUseCase: MoveBlockUseCaseInterface,
  ) {}
  @Get()
  async getBlocksForTask(@Param('taskId', ParseIntPipe) taskId: number) {
    const blocks = await this.allBlocksForTaskUseCase.execute(taskId);
    if (blocks.length === 0) {
      return {
        message: 'No blocks found for this task',
      };
    }
    return {
      message: 'Blocks retrieved successfully',
      data: blocks,
    };
  }

  @Post()
  async createBlock(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() body: CreateBlockDTO,
  ) {
    const block = await this.createBlockUseCase.execute(taskId, body);
    return {
      message: 'Block created successfully',
      data: block,
    };
  }

  @Delete(':blockId')
  async deleteBlock(@Param('blockId', ParseIntPipe) blockId: number) {
    await this.deleteBlockUseCase.execute(blockId);

    return {
      message: 'Block deleted successfully',
    };
  }

  @Patch(':blockId')
  async updateBlock(
    @Param('blockId', ParseIntPipe) blockId: number,
    @Body() body: UpdateBlockDTO,
  ) {
    const block = await this.updateBlockUseCase.execute(blockId, body);

    return {
      message: 'Block updated successfully',
      data: block,
    };
  }

  @Patch(':blockId/move')
  async moveBlock(
    @Param('blockId', ParseIntPipe) blockId: number,
    @Body() body: MoveBlockDTO,
  ) {
    await this.moveBlockUseCase.execute(blockId, body);

    return {
      message: `Block ${blockId} moved successfully`,
    };
  }
}
