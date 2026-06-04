import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { WorkspacesTokens } from 'src/workspaces/workspaces.tokens';
import { WorkspaceRoleGuard } from 'src/workspaces/workspace/guards/workspace-role.guards';
import {
  Roles,
  WorkspaceRole,
} from 'src/workspaces/workspace/decorators/workspace-role.decorator';
import { CreateColumnDTO } from './dtos/create-column.dto';
import { AccessResource } from '../workspace/decorators/access-resource.decorator';

@Controller('/boards/:boardId/columns')
@UseGuards(WorkspaceRoleGuard)
export class ColumnController {
  constructor(
    @Inject(WorkspacesTokens.ColumnService)
    private readonly columnService: ColumnService,
  ) {}
  @Get()
  @AccessResource('board')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER)
  async getColumnsForBoard(@Param('boardId') boardId: number) {
    const columns = await this.columnService.allColumnsForBoard(boardId);
    if (columns.length === 0) {
      return {
        message: 'No columns found for this board',
      };
    }

    return {
      message: 'Columns retrieved successfully',
      data: columns,
    };
  }

  @Post()
  @AccessResource('board')
  @Roles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async createColumn(
    @Param('boardId') boardId: number,
    @Body() column: CreateColumnDTO,
  ) {
    const createdColumn = await this.columnService.createColumn(
      boardId,
      column,
    );

    return {
      message: 'Column created successfully',
      data: createdColumn,
    };
  }

  @Put(':columnId')
  @AccessResource('board')
  @Roles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async updateColumn(
    @Param('columnId') columnId: number,
    @Param('boardId') boardId: number,
    @Body() body: CreateColumnDTO,
  ) {
    const updatedColumn = await this.columnService.updateColumn(
      columnId,
      boardId,
      body,
    );

    return {
      message: 'Column updated successfully',
      data: updatedColumn,
    };
  }

  @Delete(':columnId')
  @AccessResource('board')
  @Roles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async deleteColumn(
    @Param('columnId') columnId: number,
    @Param('boardId') boardId: number,
  ) {
    await this.columnService.deleteColumn(columnId, boardId);

    return {
      message: 'Column deleted successfully',
    };
  }
}
