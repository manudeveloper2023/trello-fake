import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { WorkspacesTokens } from 'src/workspaces/workspaces.tokens';
import { GetUser } from 'src/shared/prisma/decorators/get-user-id.decorator';
import { CreateBoardDTO } from './dtos/create-board.dto';
import { UpdateBoardDTO } from './dtos/update-board.dto';
import {
  Roles,
  WorkspaceRole,
} from 'src/workspaces/workspace/decorators/workspace-role.decorator';

@Controller('workspaces/:workspaceId')
export class BoardController {
  constructor(
    @Inject(WorkspacesTokens.BoardService)
    private readonly boardService: BoardService,
  ) {}

  @Get('boards')
  async getBoardsForWorkspace(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @GetUser('id') userId: string,
  ) {
    const boards = await this.boardService.allBoardsForWorkspace(
      userId,
      workspaceId,
    );

    if (boards.length === 0) {
      return {
        message: 'No boards found for this workspace',
      };
    }

    return {
      message: 'Boards retrieved successfully',
      data: boards,
    };
  }

  @Post('boards')
  @Roles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async createBoard(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() board: CreateBoardDTO,
  ) {
    const createdBoard = await this.boardService.createBoard(
      workspaceId,
      board,
    );

    return {
      message: 'Board created successfully',
      data: createdBoard,
    };
  }

  @Put('boards/:boardId')
  @Roles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async updateBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() body: UpdateBoardDTO,
  ) {
    const updatedBoard = await this.boardService.updateBoard(boardId, body);

    return {
      message: 'Board updated successfully',
      data: updatedBoard,
    };
  }

  @Delete('boards/:boardId')
  @Roles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async deleteBoard(@Param('boardId', ParseIntPipe) boardId: number) {
    await this.boardService.deleteBoard(boardId);

    return {
      message: 'Board deleted successfully',
    };
  }
}
