import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { AllBlocksForTaskUseCaseInterface } from './use-cases/all-blocks-for-task.use-case';
import { BlockTokens } from './block.tokens';
import type { MoveBlockUseCaseInterface } from './use-cases/move-block.use-case';
import type { DeleteBlockUseCaseInterface } from './use-cases/delete-block.use-case';
import type { UpdateBlockUseCaseInterface } from './use-cases/update-block.use-case';
import type { CreateBlockUseCaseInterface } from './use-cases/create-block.use-case';
import type { AttachImageBlockUseCaseInterface } from './use-cases/attach-image-block.use-case';

import { CreateBlockDTO } from './dtos/create-block.dto';
import { UpdateBlockDTO } from './dtos/update-block.dto';
import { MoveBlockDTO } from './dtos/move-block.dto';
import { AttachBlockDTO } from './dtos/attach-block.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { WorkspaceRoleGuard } from '../workspace/guards/workspace-role.guards';
import {
  Roles,
  WorkspaceRole,
} from '../workspace/decorators/workspace-role.decorator';
import {
  ACCESS_RESOURCE_KEY,
  AccessResource,
} from '../workspace/decorators/access-resource.decorator';

@Controller('/tasks/:taskId/blocks')
@UseGuards(WorkspaceRoleGuard)
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
    @Inject(BlockTokens.AttachImageBlockUseCase)
    private readonly attachImageBlockUseCase: AttachImageBlockUseCaseInterface,
  ) {}
  @Get()
  @Roles(
    WorkspaceRole.OWNER,
    WorkspaceRole.ADMIN,
    WorkspaceRole.MEMBER,
    WorkspaceRole.VIEWER,
  )
  @AccessResource('task')
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
  @Roles(
    WorkspaceRole.OWNER,
    WorkspaceRole.ADMIN,
    WorkspaceRole.MEMBER,
    WorkspaceRole.VIEWER,
  )
  @AccessResource('task')
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

  @Post('attach-image')
  @Roles(
    WorkspaceRole.OWNER,
    WorkspaceRole.ADMIN,
    WorkspaceRole.MEMBER,
    WorkspaceRole.VIEWER,
  )
  @UseInterceptors(FileInterceptor('file'))
  @AccessResource('task')
  async attachImageBlock(
    @Param('taskId', ParseIntPipe) taskId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png|webp)/ }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: AttachBlockDTO,
  ) {
    const block = await this.attachImageBlockUseCase.execute(
      taskId,
      body,
      file,
    );
    return {
      message: 'Image block attached successfully',
      data: block,
    };
  }

  @Delete(':blockId')
  @Roles(
    WorkspaceRole.OWNER,
    WorkspaceRole.ADMIN,
    WorkspaceRole.MEMBER,
    WorkspaceRole.VIEWER,
  )
  @AccessResource('task')
  async deleteBlock(@Param('blockId', ParseIntPipe) blockId: number) {
    await this.deleteBlockUseCase.execute(blockId);

    return {
      message: 'Block deleted successfully',
    };
  }

  @Patch(':blockId')
  @Roles(
    WorkspaceRole.OWNER,
    WorkspaceRole.ADMIN,
    WorkspaceRole.MEMBER,
    WorkspaceRole.VIEWER,
  )
  @AccessResource('task')
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
  @Roles(
    WorkspaceRole.OWNER,
    WorkspaceRole.ADMIN,
    WorkspaceRole.MEMBER,
    WorkspaceRole.VIEWER,
  )
  @AccessResource('task')
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
