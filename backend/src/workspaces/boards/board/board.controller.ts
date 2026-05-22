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

@Controller('workspaces')
export class BoardController {
  constructor(
    @Inject(WorkspacesTokens.BoardService)
    private readonly boardService: BoardService,
  ) {}

  @Get(':workspaceId/boards')
  async getBoardsForWorkspace(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @GetUser('id') userId: string,
  ) {
    const boards = await this.boardService.allBoardsForWorkspace(
      userId,
      workspaceId,
    );

    return {
      message: 'Boards retrieved successfully',
      data: boards,
    };
  }

  @Post(':workspaceId/boards')
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

  @Put(':workspaceId/boards/:boardId')
  async updateBoard(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body() body: UpdateBoardDTO,
  ) {
    const updatedBoard = await this.boardService.updateBoard(boardId, body);

    return {
      message: 'Board updated successfully',
      data: updatedBoard,
    };
  }

  @Delete(':workspaceId/boards/:boardId')
  async deleteBoard(@Param('boardId', ParseUUIDPipe) boardId: string) {
    await this.boardService.deleteBoard(boardId);

    return {
      message: 'Board deleted successfully',
    };
  }
}
